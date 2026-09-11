import React from 'react';
import { motion } from 'framer-motion';
import { useCustomers } from '../../hooks/useCustomers';
import CustomerStats from '../../components/customers/CustomerStats';
import CustomerFilters from '../../components/customers/CustomerFilters';
import CustomerTable from '../../components/customers/CustomerTable';
import CustomerEditModal from '../../components/customers/CustomerEditModal';
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
    editOpen,
    editingCustomer,
    editLoading,
    editError,
    openEdit,
    closeEdit,
    handleDeleteCustomer,
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
          <p className="cust-subtitle">Manage your Maa's Kitchen family members and their profile details.</p>
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
        onEdit={openEdit}
      />

      {/* ── Customer Details Popup ── */}
      <CustomerEditModal
        isOpen={editOpen}
        customer={editingCustomer}
        loading={editLoading}
        loadError={editError}
        onClose={closeEdit}
        onDelete={handleDeleteCustomer}
      />
    </motion.div>
  );
}
