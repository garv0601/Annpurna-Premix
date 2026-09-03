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
 */
export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [weeklySales, setWeeklySales] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        setLoading(true);
        const [statsData, salesData, lowStockData, topData, ordersData] =
          await Promise.all([
            getDashboardStats(),
            getWeeklySales(),
            getLowStockProducts(),
            getTopSellingProducts(),
            getRecentOrders(),
          ]);

        if (!cancelled) {
          setStats(statsData);
          setWeeklySales(salesData);
          setLowStock(lowStockData);
          setTopSelling(topData);
          setRecentOrders(ordersData);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load dashboard data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  return { stats, weeklySales, lowStock, topSelling, recentOrders, loading, error };
}
