import { useState, useEffect, useCallback } from 'react';
import { getOrders, getOrderStats, getOrderDetails } from '../services/orderService';

/**
 * Custom hook for the Order Management page.
 * Manages orders list, stats, filters, pagination, and detail view.
 */
export function useOrders() {
  /* ── Stats ── */
  const [stats, setStats] = useState(null);

  /* ── Orders list ── */
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  /* ── Filters ── */
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState('');

  /* ── Detail view ── */
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  /* ── State ── */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ── Fetch orders ── */
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, ordersData] = await Promise.all([
        getOrderStats(),
        getOrders({ page, pageSize, search, status: statusFilter, dateRange }),
      ]);
      setStats(statsData);
      setOrders(ordersData.orders);
      setTotal(ordersData.total);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter, dateRange]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const [statsData, ordersData] = await Promise.all([
          getOrderStats(),
          getOrders({ page, pageSize, search, status: statusFilter, dateRange }),
        ]);
        if (!cancelled) {
          setStats(statsData);
          setOrders(ordersData.orders);
          setTotal(ordersData.total);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load orders');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [page, pageSize, search, statusFilter, dateRange]);

  /* ── Open order detail ── */
  const openDetail = useCallback(async (orderId) => {
    try {
      const detail = await getOrderDetails(orderId);
      setSelectedOrder(detail);
      setDetailOpen(true);
    } catch (err) {
      console.error('Failed to load order details:', err);
    }
  }, []);

  const closeDetail = useCallback(() => {
    setDetailOpen(false);
    setTimeout(() => setSelectedOrder(null), 300); // clear after animation
  }, []);

  /* ── Pagination helpers ── */
  const totalPages = Math.ceil(total / pageSize);
  const canPrev = page > 1;
  const canNext = page < totalPages;
  const goNext = () => canNext && setPage((p) => p + 1);
  const goPrev = () => canPrev && setPage((p) => p - 1);

  /* ── Reset page when filters change ── */
  const applySearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const applyStatusFilter = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const applyDateRange = (value) => {
    setDateRange(value);
    setPage(1);
  };

  return {
    stats,
    orders,
    total,
    page,
    pageSize,
    totalPages,
    loading,
    error,
    // Filters
    search,
    statusFilter,
    dateRange,
    applySearch,
    applyStatusFilter,
    applyDateRange,
    // Pagination
    canPrev,
    canNext,
    goNext,
    goPrev,
    // Detail
    selectedOrder,
    detailOpen,
    openDetail,
    closeDetail,
  };
}
