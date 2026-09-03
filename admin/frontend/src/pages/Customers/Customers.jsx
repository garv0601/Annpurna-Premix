import React from 'react';
import { motion } from 'framer-motion';
import { useCustomers } from '../../hooks/useCustomers';
import CustomerStats from '../../components/customers/CustomerStats';
import CustomerFilters from '../../components/customers/CustomerFilters';
import CustomerTable from '../../components/customers/CustomerTable';
import CustomerDetails from '../../components/customers/CustomerDetails';
import './Customers.css';

export default function Customers() {
  const {
    customers,
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
    handleDeactivate,
    handleActivate,
  } = useCustomers();

  if (loading && customers.length === 0) {
    return (
      <div className="cust-loading">
        <div className="loading-spinner" />
        <p>Loading customers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cust-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="customers-page"
      id="admin-customers"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* ── Page Header ── */}
      <div className="cust-header">
        <div className="cust-header-left">
          <h1 className="cust-title">Customers</h1>
          <p className="cust-subtitle">Manage your Annpurna family members and view their order history.</p>
        </div>
      </div>

      {/* ── Statistics ── */}
      <CustomerStats stats={stats} />

      {/* ── Filters ── */}
      <CustomerFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
      />

      {/* ── Customer Table ── */}
      <CustomerTable
        customers={customers}
        onView={openDetail}
      />

      {/* ── Customer Detail Drawer ── */}
      <CustomerDetails
        customer={selectedCustomer}
        orders={customerOrders}
        addresses={customerAddresses}
        loading={ordersLoading}
        isOpen={detailOpen}
        onClose={closeDetail}
        onDeactivate={handleDeactivate}
        onActivate={handleActivate}
      />
    </motion.div>
  );
}
