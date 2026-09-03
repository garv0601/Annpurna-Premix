/**
 * ANNPURNA Admin — Order Service
 *
 * Fetches real order data from the backend API, which queries Supabase.
 * Admin authentication is handled via the admin's Supabase session JWT.
 *
 * Replaces the previous mock data implementation.
 */

import { supabase } from '../lib/supabase';

// Use the Vite dev proxy (/api → http://localhost:5000/api)
// In production, replace with the actual backend URL
const BACKEND_API = '/api';


/**
 * Get the admin's current Supabase session access token.
 */
async function getAdminToken() {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token || null;
}

/**
 * Fetch order summary statistics.
 */
export async function getOrderStats() {
  try {
    const token = await getAdminToken();
    const res = await fetch(`${BACKEND_API}/admin/orders/stats`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) throw new Error('Failed to fetch stats');

    const { stats } = await res.json();
    return {
      pending:        stats.pending        || 0,
      pendingTrend:   stats.pendingTrend   || '',
      shipped:        stats.shipped        || 0,
      shippedTrend:   stats.shippedTrend   || '',
      delivered:      stats.delivered      || 0,
      deliveredTrend: stats.deliveredTrend || '',
      cancelled:      stats.cancelled      || 0,
      cancelledTrend: stats.cancelledTrend || '',
    };
  } catch (err) {
    console.error('[Admin OrderService] getOrderStats error:', err);
    return { pending: 0, pendingTrend: '', shipped: 0, shippedTrend: '', delivered: 0, deliveredTrend: '', cancelled: 0, cancelledTrend: '' };
  }
}

/**
 * Fetch paginated orders with optional filters.
 *
 * @param {object} params
 * @param {number} params.page
 * @param {number} params.pageSize
 * @param {string} [params.search]
 * @param {string} [params.status]
 * @param {string} [params.dateRange]
 */
export async function getOrders({ page = 1, pageSize = 10, search = '', status = '', dateRange = '' } = {}) {
  const token = await getAdminToken();

  const params = new URLSearchParams({
    page:     String(page),
    pageSize: String(pageSize),
    ...(search    && { search }),
    ...(status    && { status }),
    ...(dateRange && { dateRange }),
  });

  const res = await fetch(`${BACKEND_API}/admin/orders?${params}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch orders');
  }

  const data = await res.json();
  return {
    orders:   data.orders   || [],
    total:    data.total    || 0,
    page:     data.page     || page,
    pageSize: data.pageSize || pageSize,
  };
}

/**
 * Fetch a single order with full details.
 *
 * @param {string} orderId
 */
export async function getOrderDetails(orderId) {
  const token = await getAdminToken();

  const res = await fetch(`${BACKEND_API}/admin/orders/${orderId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Order not found');
  }

  const { order } = await res.json();
  return order;
}

/**
 * Update order status.
 * Future: implement a backend PATCH endpoint.
 */
export async function updateOrderStatus(orderId, newStatus) {
  console.log(`[Admin OrderService] Update order ${orderId} to ${newStatus} — endpoint not yet implemented`);
  return { success: true };
}
