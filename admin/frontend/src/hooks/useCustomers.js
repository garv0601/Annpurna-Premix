import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getCustomers,
  getCustomerStats,
  getCustomerProfile,
  updateCustomerProfile,
  deactivateCustomer,
  activateCustomer,
  deleteCustomer,
} from '../services/customerService';

/**
 * useCustomers — hook for the Admin Customers page.
 *
 * Provides:
 *   - Real customer data from Supabase (Profiles + orders aggregates)
 *   - KPI statistics (total, new, active, repeat)
 *   - Search (name, email, phone)
 *   - Status filter
 *   - Date filter (predefined ranges)
 *   - Edit-profile modal (loads the selected customer's real Profile row)
 *   - Customer profile update (existing Profiles columns only)
 */
export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  /* ── Fetch all data ── */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [customersData, statsData] = await Promise.all([
        getCustomers(),
        getCustomerStats()
      ]);
      setCustomers(customersData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      console.error('Customer data fetch error:', err);
      setError('Unable to load customers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ── Filtered customers (search + status + date) ── */
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      // Status filter
      const matchStatus = statusFilter ? cust.status === statusFilter : true;

      // Search filter (name, email, phone)
      const searchLower = search.toLowerCase();
      const matchSearch =
        searchLower === '' ||
        (cust.full_name || '').toLowerCase().includes(searchLower) ||
        (cust.first_name || '').toLowerCase().includes(searchLower) ||
        (cust.last_name || '').toLowerCase().includes(searchLower) ||
        (cust.email || '').toLowerCase().includes(searchLower) ||
        (cust.phone || '').includes(searchLower);

      // Date filter (based on created_at)
      let matchDate = true;
      if (dateFilter && cust.created_at) {
        const createdAt = new Date(cust.created_at);
        const now = new Date();
        switch (dateFilter) {
          case 'today': {
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            matchDate = createdAt >= startOfDay;
            break;
          }
          case 'last_7_days': {
            const sevenDaysAgo = new Date(now);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            matchDate = createdAt >= sevenDaysAgo;
            break;
          }
          case 'last_30_days': {
            const thirtyDaysAgo = new Date(now);
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            matchDate = createdAt >= thirtyDaysAgo;
            break;
          }
          case 'last_90_days': {
            const ninetyDaysAgo = new Date(now);
            ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
            matchDate = createdAt >= ninetyDaysAgo;
            break;
          }
          case 'this_year': {
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            matchDate = createdAt >= startOfYear;
            break;
          }
          default:
            matchDate = true;
        }
      }

      return matchStatus && matchSearch && matchDate;
    });
  }, [customers, search, statusFilter, dateFilter]);

  /* ── Open edit-profile modal (load the customer's real Profile row) ── */
  const openEdit = useCallback(async (customer) => {
    setEditOpen(true);
    setEditLoading(true);
    setEditError(null);
    setEditingCustomer(null);
    try {
      // Always fetch fresh by id so we can never show a stale record or
      // another customer's data.
      const profile = await getCustomerProfile(customer.id);
      setEditingCustomer(profile);
    } catch (err) {
      console.error('Failed to load customer profile:', err);
      setEditError(err.message || 'Unable to load customer profile.');
    } finally {
      setEditLoading(false);
    }
  }, []);

  const closeEdit = useCallback(() => {
    setEditOpen(false);
    setTimeout(() => {
      setEditingCustomer(null);
      setEditError(null);
    }, 300);
  }, []);

  /* ── Save profile changes (existing Profiles columns only) ── */
  const handleUpdateCustomer = useCallback(async (customerId, fields) => {
    try {
      await updateCustomerProfile(customerId, fields);
      await fetchData(); // Refresh list + stats so the table reflects changes
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchData]);

  /* ── Deactivate / Activate customer (Status only) ── */
  const handleDeactivate = useCallback(async (customerId) => {
    try {
      await deactivateCustomer(customerId);
      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchData]);

  const handleActivate = useCallback(async (customerId) => {
    try {
      await activateCustomer(customerId);
      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchData]);

  /* ── Delete customer (permanent — cannot be undone) ── */
  const handleDeleteCustomer = useCallback(async (customerId) => {
    try {
      await deleteCustomer(customerId);
      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchData]);

  return {
    customers: filteredCustomers,
    allCustomers: customers,
    stats,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,

    editOpen,
    editingCustomer,
    editLoading,
    editError,
    openEdit,
    closeEdit,
    handleUpdateCustomer,
    handleDeactivate,
    handleActivate,
    handleDeleteCustomer,
    refreshData: fetchData,
  };
}
