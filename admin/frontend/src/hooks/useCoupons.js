import { useState, useEffect, useCallback, useMemo } from 'react';
import { getCoupons, getCouponStats, createCoupon, updateCoupon } from '../services/couponService';

export function useCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [couponToEdit, setCouponToEdit] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [data, statsData] = await Promise.all([getCoupons(), getCouponStats()]);
      setCoupons(data);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const matchStatus = statusFilter ? c.status === statusFilter : true;
      const matchType = typeFilter ? c.discount_type === typeFilter : true;
      const matchSearch = search === '' || c.code.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchType && matchSearch;
    });
  }, [coupons, search, statusFilter, typeFilter]);

  const handleAdd = useCallback(async (formData) => {
    try {
      await createCoupon(formData);
      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchData]);

  const openEdit = useCallback((coupon) => {
    setCouponToEdit(coupon);
    setEditOpen(true);
  }, []);

  const closeEdit = useCallback(() => {
    setEditOpen(false);
    setTimeout(() => setCouponToEdit(null), 300);
  }, []);

  const handleEdit = useCallback(async (id, formData) => {
    try {
      await updateCoupon(id, formData);
      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchData]);

  return {
    coupons: filteredCoupons,
    stats,
    loading,
    error,
    
    search, setSearch,
    statusFilter, setStatusFilter,
    typeFilter, setTypeFilter,

    addOpen, setAddOpen, handleAdd,
    editOpen, couponToEdit, openEdit, closeEdit, handleEdit,
  };
}
