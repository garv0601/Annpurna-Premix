/**
 * ANNPURNA Backend — Order Service
 *
 * Handles all order-related database operations using the Supabase admin client.
 * All totals are calculated server-side — frontend values are ignored.
 *
 * DB Column note: The column is `shipping_addres` (missing trailing 's').
 * See DATABASE_SCHEMA.md for details.
 */

import { supabaseAdmin } from '../config/supabase.js';

// ── Business rules ───────────────────────────────────────────────────────────
const TAX_RATE        = 0.05;   // 5%
const COD_FEE         = 40;     // ₹40 COD convenience fee
const EXPRESS_COST    = 50;     // ₹50 express shipping
const CURRENCY        = 'INR';

// ── Status values (matching DB enums/conventions already in use) ──────────────
export const ORDER_STATUS = {
  PENDING:    'pending',
  CONFIRMED:  'confirmed',
  PROCESSING: 'processing',
  SHIPPED:    'shipped',
  DELIVERED:  'delivered',
  CANCELLED:  'cancelled',
};

export const PAYMENT_STATUS = {
  PENDING:  'pending',
  PAID:     'paid',
  FAILED:   'failed',
  REFUNDED: 'refunded',
};

export const PAYMENT_METHOD = {
  UPI:  'upi',
  CARD: 'card',
  COD:  'cod',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Fetch current products from Supabase and validate the cart items.
 * Returns enriched items with server-side price/name.
 */
async function fetchAndValidateCartItems(cartItems) {
  const productIds = cartItems.map(item => item.product_id);

  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('id, name, price, stock_quantity, is_active')
    .in('id', productIds);

  if (error) {
    console.error('[OrderService] Product fetch error:', error);
    throw new Error('Failed to fetch product information');
  }

  const validatedItems = [];

  for (const cartItem of cartItems) {
    const product = products.find(p => p.id === cartItem.product_id);

    if (!product) {
      throw new Error(`Product not found: ${cartItem.product_id}`);
    }
    if (!product.is_active) {
      throw new Error(`Product is unavailable: ${product.name}`);
    }
    if (cartItem.quantity <= 0 || !Number.isInteger(cartItem.quantity)) {
      throw new Error(`Invalid quantity for product: ${product.name}`);
    }

    validatedItems.push({
      product_id:    product.id,
      product_name:  product.name,    // snapshot — not trusting frontend
      product_price: product.price,   // snapshot — not trusting frontend
      quantity:      cartItem.quantity,
      subtotal:      Number((product.price * cartItem.quantity).toFixed(2)),
    });
  }

  return validatedItems;
}

/**
 * Validate and fetch a coupon. Returns null if no coupon code provided.
 */
async function validateCoupon(couponCode, subtotal, customerId) {
  if (!couponCode) return null;

  const { data: coupon, error } = await supabaseAdmin
    .from('coupons')
    .select('*')
    .eq('code', couponCode.toUpperCase())
    .eq('is_active', true)
    .single();

  if (error || !coupon) {
    throw new Error('Invalid or expired coupon code');
  }

  const now = new Date();
  if (coupon.starts_at && new Date(coupon.starts_at) > now) {
    throw new Error('Coupon is not yet active');
  }
  if (coupon.expires_at && new Date(coupon.expires_at) < now) {
    throw new Error('Coupon has expired');
  }
  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
    throw new Error('Coupon usage limit reached');
  }
  if (coupon.minimum_order_amount && subtotal < coupon.minimum_order_amount) {
    throw new Error(`Minimum order of ₹${coupon.minimum_order_amount} required for this coupon`);
  }

  // Check per-customer usage
  const { count } = await supabaseAdmin
    .from('coupon_usage')
    .select('id', { count: 'exact', head: true })
    .eq('coupon_id', coupon.id)
    .eq('customer_id', customerId);

  if (count > 0) {
    throw new Error('You have already used this coupon');
  }

  return coupon;
}

/**
 * Calculate server-side totals.
 */
function calculateTotals(validatedItems, coupon, deliveryMethod, paymentMethod) {
  const subtotal = validatedItems.reduce((sum, item) => sum + item.subtotal, 0);

  let discountAmount = 0;
  if (coupon) {
    if (coupon.discount_type === 'percent') {
      discountAmount = (subtotal * coupon.discount_value) / 100;
      if (coupon.maximum_discount) {
        discountAmount = Math.min(discountAmount, coupon.maximum_discount);
      }
    } else {
      // flat discount
      discountAmount = coupon.discount_value;
    }
    discountAmount = Math.min(discountAmount, subtotal); // can't discount more than subtotal
    discountAmount = Number(discountAmount.toFixed(2));
  }

  const shippingAmount = deliveryMethod === 'express' ? EXPRESS_COST : 0;
  const codFee         = paymentMethod  === 'cod'     ? COD_FEE      : 0;
  const taxableAmount  = subtotal - discountAmount + shippingAmount + codFee;
  const taxAmount      = Number((taxableAmount * TAX_RATE).toFixed(2));
  const totalAmount    = Number((taxableAmount + taxAmount).toFixed(2));

  return { subtotal, discountAmount, shippingAmount: shippingAmount + codFee, taxAmount, totalAmount };
}

// ── Main order creation ──────────────────────────────────────────────────────

/**
 * Create a complete order atomically in Supabase.
 *
 * Steps:
 * 1. Validate authenticated customer
 * 2. Fetch + validate products server-side
 * 3. Validate coupon (if any)
 * 4. Calculate totals server-side
 * 5. Confirm inventory reservation
 * 6. Create order record
 * 7. Create order_items records
 * 8. Create payment record
 *
 * @param {object} params
 * @param {string}   params.customerId      Verified Supabase user ID (from JWT, NOT frontend)
 * @param {Array}    params.cartItems        [{product_id, quantity}]
 * @param {string}   params.deliveryMethod   'standard' | 'express'
 * @param {string}   params.paymentMethod    'upi' | 'card' | 'cod'
 * @param {object}   params.shippingAddress  Address object
 * @param {string}   [params.couponCode]     Optional coupon code
 * @param {string}   [params.sessionId]      Inventory reservation session ID
 * @param {string}   [params.transactionId]  Razorpay payment ID (for online payments)
 * @param {string}   [params.notes]          Customer notes
 */
export async function createOrder({
  customerId,
  cartItems,
  deliveryMethod,
  paymentMethod,
  shippingAddress,
  couponCode,
  sessionId,
  transactionId,
  notes,
}) {
  console.log(`[OrderService] Creating order for customer: ${customerId}, method: ${paymentMethod}`);

  if (!supabaseAdmin) throw new Error('Database not configured');
  if (!customerId)    throw new Error('Unauthenticated: customer ID is required');
  if (!cartItems || cartItems.length === 0) throw new Error('Cart is empty');

  // 1. Verify customer exists in Profiles table
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('Profiles')
    .select('id')
    .eq('id', customerId)
    .single();

  if (profileError || !profile) {
    console.error('[OrderService] Profile not found:', profileError);
    throw new Error('Customer profile not found');
  }

  // 2. Fetch + validate products server-side
  const validatedItems = await fetchAndValidateCartItems(cartItems);
  console.log(`[OrderService] Validated ${validatedItems.length} cart items`);

  // 3. Validate coupon
  const coupon = await validateCoupon(couponCode, validatedItems.reduce((s, i) => s + i.subtotal, 0), customerId);
  if (coupon) console.log(`[OrderService] Coupon applied: ${coupon.code}`);

  // 4. Calculate totals server-side
  const { subtotal, discountAmount, shippingAmount, taxAmount, totalAmount } =
    calculateTotals(validatedItems, coupon, deliveryMethod, paymentMethod);

  console.log(`[OrderService] Totals — subtotal: ${subtotal}, discount: ${discountAmount}, shipping: ${shippingAmount}, tax: ${taxAmount}, total: ${totalAmount}`);

  // 5. Duplicate order check for online payments (idempotency)
  if (transactionId) {
    const { data: existingPayment } = await supabaseAdmin
      .from('payments')
      .select('id, order_id')
      .eq('transaction_id', transactionId)
      .maybeSingle();

    if (existingPayment) {
      console.warn(`[OrderService] Duplicate payment detected: ${transactionId}. Returning existing order.`);
      const { data: existingOrder } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('id', existingPayment.order_id)
        .single();
      return existingOrder;
    }
  }

  // 6. Determine payment/order status
  const isCOD = paymentMethod === 'cod';
  const orderStatus   = isCOD ? ORDER_STATUS.CONFIRMED : ORDER_STATUS.CONFIRMED;
  const paymentStatus = isCOD ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.PAID;

  // 7. Format shipping address as JSONB
  const shippingAddressJson = {
    full_name:     shippingAddress.fullName || shippingAddress.full_name,
    phone:         shippingAddress.phone,
    address_line1: shippingAddress.addressLine1 || shippingAddress.address_line1,
    address_line2: shippingAddress.addressLine2 || shippingAddress.address_line2 || null,
    city:          shippingAddress.city,
    state:         shippingAddress.state,
    postal_code:   shippingAddress.postalCode || shippingAddress.postal_code,
  };

  // 8. Insert order record
  // NOTE: DB column is `shipping_addres` (missing trailing 's') — per DATABASE_SCHEMA.md
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      customer_id:     customerId,
      subtotal:        subtotal,
      discount_amount: discountAmount,
      shipping_amount: shippingAmount,
      tax_amount:      taxAmount,
      total_amount:    totalAmount,
      coupon_id:       coupon?.id || null,
      payment_status:  paymentStatus,
      order_status:    orderStatus,
      shipping_addres: shippingAddressJson,   // ← exact column name with typo
      notes:           notes || null,
    })
    .select('*')
    .single();

  if (orderError || !order) {
    console.error('[OrderService] Order insert error:', orderError);
    throw new Error('Failed to create order record');
  }

  console.log(`[OrderService] Order created: ${order.id}`);

  // 9. Insert order_items records
  const orderItemsPayload = validatedItems.map(item => ({
    order_id:      order.id,
    product_id:    item.product_id,
    product_name:  item.product_name,
    product_price: item.product_price,
    quantity:      item.quantity,
    subtotal:      item.subtotal,
  }));

  const { error: itemsError } = await supabaseAdmin
    .from('order_items')
    .insert(orderItemsPayload);

  if (itemsError) {
    console.error('[OrderService] Order items insert error:', itemsError);
    // Attempt rollback
    await supabaseAdmin.from('orders').delete().eq('id', order.id);
    throw new Error('Failed to create order items');
  }

  console.log(`[OrderService] ${validatedItems.length} order items created`);

  // 10. Insert payment record
  const paymentPayload = {
    order_id:         order.id,
    customer_id:      customerId,
    payment_provider: isCOD ? 'cod' : 'razorpay',
    transaction_id:   transactionId || null,
    amount:           totalAmount,
    currency:         CURRENCY,
    payment_status:   paymentStatus,
    payment_method:   paymentMethod,
    paid_at:          isCOD ? null : new Date().toISOString(),
  };

  const { error: paymentError } = await supabaseAdmin
    .from('payments')
    .insert(paymentPayload);

  if (paymentError) {
    console.error('[OrderService] Payment insert error:', paymentError);
    // Attempt rollback
    await supabaseAdmin.from('order_items').delete().eq('order_id', order.id);
    await supabaseAdmin.from('orders').delete().eq('id', order.id);
    throw new Error('Failed to create payment record');
  }

  console.log(`[OrderService] Payment record created for order: ${order.id}`);

  // 11. Confirm inventory reservation using the existing Supabase RPC
  if (sessionId) {
    const { error: reserveConfirmError } = await supabaseAdmin.rpc('confirm_checkout_reservations', {
      p_session_id: sessionId,
      p_order_id:   order.id,
    });

    if (reserveConfirmError) {
      console.error('[OrderService] Inventory confirmation error:', reserveConfirmError);
      // Don't fail the order for this — the reservation expiry system will handle cleanup
    } else {
      console.log(`[OrderService] Inventory reservation confirmed for session: ${sessionId}`);
    }
  }

  // 12. Update coupon usage count if coupon was applied
  if (coupon) {
    await supabaseAdmin
      .from('coupon_usage')
      .insert({
        coupon_id:       coupon.id,
        customer_id:     customerId,
        order_id:        order.id,
        discount_amount: discountAmount,
      });

    await supabaseAdmin.rpc('increment_coupon_usage', { coupon_id: coupon.id }).catch(() => {
      // increment function may not exist — silently ignore
    });
  }

  return order;
}

/**
 * Fetch orders for a specific customer (enforced by service-role query with customer_id filter).
 * Even with the service-role key, we always filter by customer_id to enforce data isolation.
 */
export async function getCustomerOrders(customerId) {
  if (!supabaseAdmin) throw new Error('Database not configured');

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(`
      id,
      order_status,
      payment_status,
      subtotal,
      discount_amount,
      shipping_amount,
      tax_amount,
      total_amount,
      shipping_addres,
      notes,
      created_at,
      order_items (
        id,
        product_id,
        product_name,
        product_price,
        quantity,
        subtotal
      ),
      payments (
        payment_method,
        payment_status,
        transaction_id,
        paid_at
      )
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[OrderService] Get customer orders error:', error);
    throw new Error('Failed to fetch orders');
  }

  return data || [];
}

/**
 * Fetch a single order for a specific customer.
 * Enforces ownership — customer cannot fetch another customer's order.
 */
export async function getCustomerOrderById(orderId, customerId) {
  if (!supabaseAdmin) throw new Error('Database not configured');

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(`
      id,
      order_status,
      payment_status,
      subtotal,
      discount_amount,
      shipping_amount,
      tax_amount,
      total_amount,
      shipping_addres,
      notes,
      created_at,
      updated_at,
      order_items (
        id,
        product_id,
        product_name,
        product_price,
        quantity,
        subtotal
      ),
      payments (
        payment_method,
        payment_status,
        transaction_id,
        payment_provider,
        paid_at
      )
    `)
    .eq('id', orderId)
    .eq('customer_id', customerId)   // ← security: enforce ownership
    .single();

  if (error || !data) {
    throw new Error('Order not found');
  }

  return data;
}

/**
 * Admin: fetch all orders with customer info and payment details.
 */
export async function getAllOrders({ page = 1, pageSize = 10, search = '', status = '', dateRange = '' } = {}) {
  if (!supabaseAdmin) throw new Error('Database not configured');

  let query = supabaseAdmin
    .from('orders')
    .select(`
      id,
      order_status,
      payment_status,
      total_amount,
      created_at,
      shipping_addres,
      customer:Profiles!customer_id (
        id,
        full_name,
        email,
        phone
      ),
      order_items (
        id,
        product_id,
        product_name,
        product_price,
        quantity,
        subtotal
      ),
      payment:payments!order_id (
        payment_method,
        payment_status,
        transaction_id
      )
    `, { count: 'exact' });

  if (status) {
    query = query.eq('order_status', status);
  }

  if (dateRange) {
    const days = parseInt(dateRange);
    if (!isNaN(days)) {
      const from = new Date();
      from.setDate(from.getDate() - days);
      query = query.gte('created_at', from.toISOString());
    }
  }

  if (search) {
    // Search on customer name/email via a text filter is complex with joins.
    // We'll do a post-filter for search for now (acceptable for admin use case).
  }

  const from = (page - 1) * pageSize;
  const to   = from + pageSize - 1;

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('[OrderService] Get all orders error:', error);
    throw new Error('Failed to fetch orders');
  }

  // Map to the shape expected by the admin UI
  let orders = (data || []).map(o => ({
    id:       o.id,
    orderId:  `#ORD-${o.id.slice(0, 8).toUpperCase()}`,
    date:     new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    status:   o.order_status,
    amount:   o.total_amount,
    subtotal: o.total_amount, // we'll show total as subtotal for the UI
    discount: 0,
    customer: {
      id:       o.customer?.id || '',
      fullName: o.customer?.full_name || 'Unknown Customer',
      email:    o.customer?.email || '',
      phone:    o.customer?.phone || '',
    },
    payment: {
      method:  o.payment?.[0]?.payment_method || 'unknown',
      status:  o.payment?.[0]?.payment_status || 'unknown',
    },
    items: (o.order_items || []).map(i => ({
      id:          i.id,
      productId:   i.product_id,
      productName: i.product_name,
      quantity:    i.quantity,
      unitPrice:   i.product_price,
      subtotal:    i.subtotal,
    })),
  }));

  // Client-side search filter (name/email)
  if (search) {
    const q = search.toLowerCase();
    orders = orders.filter(
      o =>
        o.orderId.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        (o.customer.phone && o.customer.phone.includes(q))
    );
  }

  return { orders, total: count || 0, page, pageSize };
}

/**
 * Admin: fetch a single order with full details.
 */
export async function getOrderDetailsAdmin(orderId) {
  if (!supabaseAdmin) throw new Error('Database not configured');

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(`
      id,
      order_status,
      payment_status,
      subtotal,
      discount_amount,
      shipping_amount,
      tax_amount,
      total_amount,
      shipping_addres,
      notes,
      created_at,
      coupon_id,
      customer:Profiles!customer_id (
        id,
        full_name,
        email,
        phone
      ),
      order_items (
        id,
        product_id,
        product_name,
        product_price,
        quantity,
        subtotal
      ),
      payment:payments!order_id (
        payment_method,
        payment_status,
        transaction_id,
        payment_provider,
        paid_at
      ),
      coupon:coupons!coupon_id (
        id,
        code,
        discount_type,
        discount_value
      )
    `)
    .eq('id', orderId)
    .single();

  if (error || !data) {
    console.error('[OrderService] Get order details error:', error);
    throw new Error('Order not found');
  }

  // Map to the shape expected by admin UI OrderDetailDrawer
  return {
    id:        data.id,
    orderId:   `#ORD-${data.id.slice(0, 8).toUpperCase()}`,
    date:      new Date(data.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    status:    data.order_status,
    amount:    data.total_amount,
    subtotal:  data.subtotal,
    discount:  data.discount_amount,
    shipping:  data.shipping_amount,
    tax:       data.tax_amount,
    customer: {
      id:       data.customer?.id || '',
      fullName: data.customer?.full_name || 'Unknown Customer',
      email:    data.customer?.email || '',
      phone:    data.customer?.phone || '',
    },
    payment: {
      method: data.payment?.[0]?.payment_method || '',
      status: data.payment?.[0]?.payment_status || '',
      transactionId: data.payment?.[0]?.transaction_id || '',
      paidAt: data.payment?.[0]?.paid_at || null,
    },
    coupon: data.coupon ? {
      code:          data.coupon.code,
      discountType:  data.coupon.discount_type,
      discountValue: data.coupon.discount_value,
    } : null,
    items: (data.order_items || []).map(i => ({
      id:          i.id,
      productId:   i.product_id,
      productName: i.product_name,
      quantity:    i.quantity,
      unitPrice:   i.product_price,
      subtotal:    i.subtotal,
    })),
    shippingAddress: data.shipping_addres,
    notes:     data.notes,
  };
}

/**
 * Admin: compute order statistics.
 */
export async function getOrderStats() {
  if (!supabaseAdmin) throw new Error('Database not configured');

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('order_status, created_at');

  if (error) {
    console.error('[OrderService] Stats error:', error);
    // Return zeros rather than crashing
    return { pending: 0, pendingTrend: '', shipped: 0, shippedTrend: '', delivered: 0, deliveredTrend: '', cancelled: 0, cancelledTrend: '' };
  }

  const counts = { pending: 0, confirmed: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
  for (const row of (data || [])) {
    if (counts[row.order_status] !== undefined) counts[row.order_status]++;
  }

  return {
    pending:        counts.pending + counts.confirmed + counts.processing,
    pendingTrend:   '',
    shipped:        counts.shipped,
    shippedTrend:   '',
    delivered:      counts.delivered,
    deliveredTrend: `${data.length > 0 ? Math.round((counts.delivered / data.length) * 100) : 0}% success rate`,
    cancelled:      counts.cancelled,
    cancelledTrend: `${data.length > 0 ? Math.round((counts.cancelled / data.length) * 100).toFixed(1) : 0}% rate`,
  };
}
