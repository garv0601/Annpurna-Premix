import { useState, useEffect } from 'react';
import {
  getDashboardStats,
  getWeeklySales,
  getLowStockProducts,
  getTopSellingProducts,
  getRecentOrders,
} from '../services/dashboardService';

/**
 * Custom hook that fetches all dashboard data.
 * Centralizes loading/error state so components stay clean.
 *
 * Each section is fetched independently (Promise.allSettled) so a single
 * failing request (e.g. one Supabase table) doesn't blank the whole
 * dashboard — the other sections still render with real data, and only the
 * failed section surfaces its own error.
 */
export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [weeklySales, setWeeklySales] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      setLoading(true);

      const [statsR, salesR, lowStockR, topR, ordersR] = await Promise.allSettled([
        getDashboardStats(),
        getWeeklySales(),
        getLowStockProducts(),
        getTopSellingProducts(),
        getRecentOrders(),
      ]);

      if (cancelled) return;

      setStats(statsR.status === 'fulfilled' ? statsR.value : null);
      setWeeklySales(salesR.status === 'fulfilled' ? salesR.value : []);
      setLowStock(lowStockR.status === 'fulfilled' ? lowStockR.value : []);
      setTopSelling(topR.status === 'fulfilled' ? topR.value : []);
      setRecentOrders(ordersR.status === 'fulfilled' ? ordersR.value : []);

      setErrors({
        stats:        statsR.status === 'rejected'     ? (statsR.reason?.message || 'Failed to load stats') : null,
        weeklySales:  salesR.status === 'rejected'      ? (salesR.reason?.message || 'Failed to load weekly sales') : null,
        lowStock:     lowStockR.status === 'rejected'   ? (lowStockR.reason?.message || 'Failed to load low stock') : null,
        topSelling:   topR.status === 'rejected'        ? (topR.reason?.message || 'Failed to load top selling items') : null,
        recentOrders: ordersR.status === 'rejected'     ? (ordersR.reason?.message || 'Failed to load recent orders') : null,
      });

      setLoading(false);
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  return { stats, weeklySales, lowStock, topSelling, recentOrders, loading, errors };
}
