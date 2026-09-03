import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getCustomers,
  getCustomerStats,
  getCustomerOrders,
  getCustomerAddresses,
  deactivateCustomer,
  activateCustomer,
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
 *   - Customer detail drawer (profile + orders + addresses)
 *   - Customer deactivation / activation
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

  // Modals / Drawers
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [customerAddresses, setCustomerAddresses] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [addOpen, setAddOpen] = useState(false);

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

  /* ── Open customer detail drawer ── */
  const openDetail = useCallback(async (customer) => {
    setSelectedCustomer(customer);
    setDetailOpen(true);
    setOrdersLoading(true);
    try {
      const [orders, addresses] = await Promise.all([
        getCustomerOrders(customer.id),
        getCustomerAddresses(customer.id),
      ]);
      setCustomerOrders(orders);
      setCustomerAddresses(addresses);
    } catch (err) {
      console.error("Failed to load customer details:", err);
      setCustomerOrders([]);
      setCustomerAddresses([]);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const closeDetail = useCallback(() => {
    setDetailOpen(false);
    setTimeout(() => {
      setSelectedCustomer(null);
      setCustomerOrders([]);
      setCustomerAddresses([]);
    }, 300);
  }, []);

  /* ── Deactivate / Activate customer ── */
  const handleDeactivate = useCallback(async (customerId) => {
    try {
      await deactivateCustomer(customerId);
      await fetchData(); // Refresh list and stats
      // If the detail drawer is open for this customer, update it
      setSelectedCustomer((prev) =>
        prev && prev.id === customerId ? { ...prev, status: 'inactive' } : prev
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchData]);

  const handleActivate = useCallback(async (customerId) => {
    try {
      await activateCustomer(customerId);
      await fetchData();
      setSelectedCustomer((prev) =>
        prev && prev.id === customerId ? { ...prev, status: 'active' } : prev
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchData]);

  /* ── Add customer (placeholder — admin can't create auth users from frontend) ── */
  const handleAdd = useCallback(async (formData) => {
    // Creating a full customer requires creating an auth.users record first,
    // which needs the service-role key (NOT safe from the frontend).
    // For now, this returns a clear message.
    return {
      success: false,
      error: 'Customer creation requires a secure backend endpoint. Customers are created when they sign up through the website.',
    };
  }, []);

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
    
    selectedCustomer,
    customerOrders,
    customerAddresses,
    ordersLoading,
    detailOpen,
    openDetail,
    closeDetail,
    
    addOpen,
    setAddOpen,
    handleAdd,
    handleDeactivate,
    handleActivate,
    refreshData: fetchData,
  };
}
