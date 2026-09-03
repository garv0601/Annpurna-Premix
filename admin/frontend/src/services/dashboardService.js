/**
 * Dashboard data service for ANNPURNA Admin.
 *
 * Currently returns realistic mock data.
 * Each function signature matches what the Supabase queries will return,
 * so swapping to real data requires only replacing the function bodies.
 */

// import { supabase } from '../lib/supabase';

/**
 * Fetch KPI stats for the dashboard overview.
 */
export async function getDashboardStats() {
  // TODO: Replace with Supabase query
  // const { data, error } = await supabase.rpc('get_dashboard_stats');
  return {
    totalSales: 45230,
    salesTrend: 'up',
    salesTrendPercent: 12.5,
    totalOrders: 142,
    ordersTrend: 'up',
    ordersTrendPercent: 8,
    newCustomers: 28,
    customersTrend: 'steady',
    customersTrendPercent: 0,
    activeProducts: 36,
    productsNeedingAttention: 2,
  };
}

/**
 * Fetch weekly sales data for the chart.
 */
export async function getWeeklySales() {
  // TODO: Replace with Supabase query
  return [
    { day: 'Mon', sales: 4200, orders: 18 },
    { day: 'Tue', sales: 5800, orders: 24 },
    { day: 'Wed', sales: 3900, orders: 16 },
    { day: 'Thu', sales: 7200, orders: 31 },
    { day: 'Fri', sales: 8500, orders: 36 },
    { day: 'Sat', sales: 9100, orders: 42 },
    { day: 'Sun', sales: 6530, orders: 28 },
  ];
}

/**
 * Fetch products with low stock levels.
 */
export async function getLowStockProducts() {
  // TODO: Replace with Supabase query
  return [
    { id: 'prod-001', name: 'Poha Mix', stock: 8 },
    { id: 'prod-002', name: 'Upma Premix', stock: 5 },
  ];
}

/**
 * Fetch top-selling products.
 */
export async function getTopSellingProducts() {
  // TODO: Replace with Supabase query
  return [
    { id: 'prod-003', name: 'Classic Poha Mix', price: 150, sold: 85, image: null },
    { id: 'prod-004', name: 'Roasted Upma', price: 120, sold: 64, image: null },
    { id: 'prod-005', name: 'Masala Oats', price: 180, sold: 42, image: null },
  ];
}

/**
 * Fetch recent orders for the dashboard table.
 */
export async function getRecentOrders() {
  // TODO: Replace with Supabase query
  return [
    { orderId: '#ORD-9021', customer: 'Priya Sharma', date: 'Today, 10:24 AM', amount: 450, status: 'preparing' },
    { orderId: '#ORD-9020', customer: 'Amit Patel', date: 'Today, 09:15 AM', amount: 1200, status: 'shipped' },
    { orderId: '#ORD-9019', customer: 'Sneha Gupta', date: 'Yesterday', amount: 320, status: 'delivered' },
    { orderId: '#ORD-9018', customer: 'Vikram Singh', date: 'Yesterday', amount: 850, status: 'delivered' },
  ];
}
