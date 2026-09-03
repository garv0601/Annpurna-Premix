/**
 * CUSTOMER SERVICE — Supabase Integration
 *
 * Connects the Admin Customers page to real Supabase data.
 *
 * Tables used:
 *   - public.Profiles   (customer profiles)
 *   - public.orders      (order statistics)
 *   - public.addresses   (customer addresses)
 *
 * IMPORTANT column casing (as per DATABASE_SCHEMA.md):
 *   - Profiles.Status     → capital 'S'
 *   - Profiles.Updated_at → capital 'U'
 */

import { supabase } from '../lib/supabase';

/* ══════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════ */

/**
 * Split a full_name string into first_name / last_name
 * for backward-compatibility with existing UI components.
 */
function splitFullName(fullName) {
  if (!fullName) return { first_name: '', last_name: '' };
  const parts = fullName.trim().split(/\s+/);
  return {
    first_name: parts[0] || '',
    last_name: parts.slice(1).join(' ') || '',
  };
}

/**
 * Enrich a raw Profiles row with computed fields the UI expects.
 * Merges order aggregate data when available.
 */
function enrichCustomer(profile, orderAgg = null) {
  const { first_name, last_name } = splitFullName(profile.full_name);

  return {
    id: profile.id,
    full_name: profile.full_name || '',
    first_name,
    last_name,
    email: profile.email || '',
    phone: profile.phone || '',
    avatar_url: profile.avatar_url || null,
    role: profile.role || null,
    status: (profile.Status || 'active').toLowerCase(),
    created_at: profile.created_at,
    updated_at: profile.Updated_at,
    // Order aggregates (filled from join or separate query)
    total_orders: orderAgg?.total_orders ?? 0,
    total_spent: orderAgg?.total_spent ?? 0,
    last_order_date: orderAgg?.last_order_date ?? null,
  };
}

/* ══════════════════════════════════════════════════════════════
   FETCH ALL CUSTOMERS  (with order aggregates — no N+1)
   ══════════════════════════════════════════════════════════════ */

/**
 * Fetch all customer profiles from Profiles table,
 * excluding admin users (role != 'admin').
 *
 * Then fetch order aggregates in a single separate query
 * and merge them — avoids N+1 queries.
 */
export async function getCustomers() {
  // 1. Fetch customer profiles (excluding admins)
  const { data: profiles, error: profilesError } = await supabase
    .from('Profiles')
    .select('id, full_name, email, phone, avatar_url, role, Status, created_at, Updated_at')
    .or('role.neq.admin,role.is.null')
    .order('created_at', { ascending: false });

  if (profilesError) {
    console.error('getCustomers profiles error:', profilesError);
    throw new Error('Unable to load customers. Please try again.');
  }

  if (!profiles || profiles.length === 0) {
    return [];
  }

  // 2. Fetch order aggregates for ALL customers in one query
  const customerIds = profiles.map((p) => p.id);

  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('customer_id, total_amount, created_at')
    .in('customer_id', customerIds);

  if (ordersError) {
    console.error('getCustomers orders error:', ordersError);
    // Non-fatal — display customers without order data
  }

  // 3. Aggregate orders per customer in memory
  const orderMap = {};
  if (orders && orders.length > 0) {
    for (const order of orders) {
      if (!orderMap[order.customer_id]) {
        orderMap[order.customer_id] = {
          total_orders: 0,
          total_spent: 0,
          last_order_date: null,
        };
      }
      const agg = orderMap[order.customer_id];
      agg.total_orders += 1;
      agg.total_spent += Number(order.total_amount) || 0;
      if (!agg.last_order_date || order.created_at > agg.last_order_date) {
        agg.last_order_date = order.created_at;
      }
    }
  }

  // 4. Merge and return enriched customers
  return profiles.map((profile) =>
    enrichCustomer(profile, orderMap[profile.id] || null)
  );
}

/* ══════════════════════════════════════════════════════════════
   CUSTOMER STATISTICS (KPIs)
   ══════════════════════════════════════════════════════════════ */

/**
 * Calculate real customer statistics:
 *   - total_customers   → count of non-admin profiles
 *   - new_customers     → created in last 30 days
 *   - active_customers  → Status = 'active' (case-insensitive)
 *   - repeat_percentage → customers with > 1 order / total × 100
 */
export async function getCustomerStats() {
  // 1. Fetch all non-admin profiles (only the fields needed for stats)
  const { data: profiles, error: profilesError } = await supabase
    .from('Profiles')
    .select('id, Status, created_at')
    .or('role.neq.admin,role.is.null');

  if (profilesError) {
    console.error('getCustomerStats profiles error:', profilesError);
    throw new Error('Unable to load customer statistics.');
  }

  const allProfiles = profiles || [];
  const totalCount = allProfiles.length;

  // New customers: created within the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoISO = thirtyDaysAgo.toISOString();

  const newCount = allProfiles.filter(
    (p) => p.created_at && p.created_at >= thirtyDaysAgoISO
  ).length;

  // Active customers: Status = 'active' (case-insensitive)
  const activeCount = allProfiles.filter(
    (p) => (p.Status || '').toLowerCase() === 'active'
  ).length;

  // Repeat customers: > 1 order — fetch order counts
  let repeatPercentage = 0;
  if (totalCount > 0) {
    const customerIds = allProfiles.map((p) => p.id);

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('customer_id')
      .in('customer_id', customerIds);

    if (!ordersError && orders) {
      // Count orders per customer
      const orderCounts = {};
      for (const o of orders) {
        orderCounts[o.customer_id] = (orderCounts[o.customer_id] || 0) + 1;
      }
      const repeatCount = Object.values(orderCounts).filter((c) => c > 1).length;
      repeatPercentage = Math.round((repeatCount / totalCount) * 100);
    }
  }

  return {
    total_customers: totalCount,
    new_customers: newCount,
    active_customers: activeCount,
    repeat_percentage: repeatPercentage,
  };
}

/* ══════════════════════════════════════════════════════════════
   CUSTOMER ORDERS (for detail drawer)
   ══════════════════════════════════════════════════════════════ */

/**
 * Fetch recent orders for a specific customer (max 10, newest first).
 */
export async function getCustomerOrders(customerId) {
  const { data, error } = await supabase
    .from('orders')
    .select('id, customer_id, total_amount, order_status, payment_status, created_at')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('getCustomerOrders error:', error);
    throw new Error('Unable to load customer orders.');
  }

  // Map to the shape the UI expects
  return (data || []).map((order) => ({
    id: order.id,
    created_at: order.created_at,
    total_amount: Number(order.total_amount) || 0,
    status: order.order_status || 'pending',
    payment_status: order.payment_status || 'pending',
  }));
}

/* ══════════════════════════════════════════════════════════════
   CUSTOMER ADDRESSES (for detail drawer)
   ══════════════════════════════════════════════════════════════ */

/**
 * Fetch all addresses for a specific customer.
 * Default address appears first.
 */
export async function getCustomerAddresses(customerId) {
  const { data, error } = await supabase
    .from('addresses')
    .select('id, label, full_name, phone, address_line_1, address_line_2, city, state, postal_code, is_default, created_at, updated_at')
    .eq('customer_id', customerId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getCustomerAddresses error:', error);
    throw new Error('Unable to load customer addresses.');
  }

  return data || [];
}

/* ══════════════════════════════════════════════════════════════
   CUSTOMER DEACTIVATION (safe — no auth deletion)
   ══════════════════════════════════════════════════════════════ */

/**
 * Deactivate a customer by setting their Status to 'inactive'.
 *
 * IMPORTANT: This does NOT delete the user from auth.users.
 * Permanent auth deletion requires a secure backend endpoint
 * with the service-role key — never from the frontend.
 */
export async function deactivateCustomer(customerId) {
  const { data, error } = await supabase
    .from('Profiles')
    .update({ Status: 'inactive', Updated_at: new Date().toISOString() })
    .eq('id', customerId)
    .select('id, full_name, Status')
    .single();

  if (error) {
    console.error('deactivateCustomer error:', error);
    throw new Error('Unable to deactivate customer. Please try again.');
  }

  return data;
}

/**
 * Reactivate a customer by setting their Status to 'active'.
 */
export async function activateCustomer(customerId) {
  const { data, error } = await supabase
    .from('Profiles')
    .update({ Status: 'active', Updated_at: new Date().toISOString() })
    .eq('id', customerId)
    .select('id, full_name, Status')
    .single();

  if (error) {
    console.error('activateCustomer error:', error);
    throw new Error('Unable to activate customer. Please try again.');
  }

  return data;
}
