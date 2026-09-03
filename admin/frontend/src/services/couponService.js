/**
 * MOCK COUPON SERVICE
 * Temporary local data store for coupons.
 */

let MOCK_COUPONS = [
  {
    id: 'coup_1',
    code: 'WELCOME20',
    discount_type: 'percentage',
    discount_value: 20,
    min_order_amount: 500,
    max_discount: 200,
    usage_limit: 100,
    usage_count: 45,
    start_date: '2024-01-01T00:00:00Z',
    expiry_date: '2025-10-31T23:59:59Z',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'coup_2',
    code: 'FIRSTORDER',
    discount_type: 'fixed',
    discount_value: 50,
    min_order_amount: 300,
    max_discount: 50,
    usage_limit: null, // Unlimited
    usage_count: 1204,
    start_date: '2024-02-01T00:00:00Z',
    expiry_date: null,
    status: 'active',
    created_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'coup_3',
    code: 'SUMMERREFRESH',
    discount_type: 'percentage',
    discount_value: 15,
    min_order_amount: 600,
    max_discount: 150,
    usage_limit: 200,
    usage_count: 200,
    start_date: '2024-06-01T00:00:00Z',
    expiry_date: '2024-08-31T23:59:59Z',
    status: 'expired',
    created_at: '2024-05-15T00:00:00Z',
  },
  {
    id: 'coup_4',
    code: 'DIWALI500',
    discount_type: 'fixed',
    discount_value: 500,
    min_order_amount: 2500,
    max_discount: 500,
    usage_limit: 50,
    usage_count: 0,
    start_date: '2024-11-01T00:00:00Z',
    expiry_date: '2024-11-15T23:59:59Z',
    status: 'scheduled',
    created_at: '2024-10-01T00:00:00Z',
  }
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getCoupons() {
  await delay(400);
  return [...MOCK_COUPONS];
}

export async function getCouponStats() {
  await delay(300);
  const activeCount = MOCK_COUPONS.filter(c => c.status === 'active').length;
  // Mock expiring soon as any active coupon with an expiry date
  const expiringSoon = MOCK_COUPONS.filter(c => c.status === 'active' && c.expiry_date).length;
  const totalUsage = MOCK_COUPONS.reduce((sum, c) => sum + c.usage_count, 0);
  
  return {
    total_coupons: MOCK_COUPONS.length,
    active_coupons: activeCount,
    expiring_soon: expiringSoon,
    total_usage: totalUsage,
  };
}

export async function createCoupon(data) {
  await delay(500);
  const newCoupon = {
    id: `coup_${Math.floor(Math.random() * 10000)}`,
    code: data.code.toUpperCase(),
    discount_type: data.discount_type,
    discount_value: Number(data.discount_value),
    min_order_amount: data.min_order_amount ? Number(data.min_order_amount) : null,
    max_discount: data.max_discount ? Number(data.max_discount) : null,
    usage_limit: data.usage_limit ? Number(data.usage_limit) : null,
    usage_count: 0,
    start_date: data.start_date || null,
    expiry_date: data.expiry_date || null,
    status: data.status || 'active',
    created_at: new Date().toISOString(),
  };
  
  MOCK_COUPONS.unshift(newCoupon);
  return newCoupon;
}

export async function updateCoupon(id, data) {
  await delay(500);
  const index = MOCK_COUPONS.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Coupon not found');
  
  MOCK_COUPONS[index] = {
    ...MOCK_COUPONS[index],
    ...data,
    code: data.code ? data.code.toUpperCase() : MOCK_COUPONS[index].code,
    discount_value: data.discount_value !== undefined ? Number(data.discount_value) : MOCK_COUPONS[index].discount_value,
    min_order_amount: data.min_order_amount !== undefined ? (data.min_order_amount ? Number(data.min_order_amount) : null) : MOCK_COUPONS[index].min_order_amount,
    max_discount: data.max_discount !== undefined ? (data.max_discount ? Number(data.max_discount) : null) : MOCK_COUPONS[index].max_discount,
    usage_limit: data.usage_limit !== undefined ? (data.usage_limit ? Number(data.usage_limit) : null) : MOCK_COUPONS[index].usage_limit,
  };
  
  return MOCK_COUPONS[index];
}
