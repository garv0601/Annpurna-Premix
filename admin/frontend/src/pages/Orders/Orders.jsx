import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Plus } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import OrderStats from '../../components/orders/OrderStats';
import OrderFilters from '../../components/orders/OrderFilters';
import OrdersTable from '../../components/orders/OrdersTable';
import OrderDetailDrawer from '../../components/orders/OrderDetailDrawer';
import NewOrderModal from '../../components/orders/NewOrderModal';
import './Orders.css';

export default function Orders() {
  const {
    stats,
    orders,
    total,
    page,
    pageSize,
    totalPages,
    loading,
    error,
    search,
    statusFilter,
    dateRange,
    applySearch,
    applyStatusFilter,
    applyDateRange,
    canPrev,
    canNext,
    goNext,
    goPrev,
    selectedOrder,
    detailOpen,
    openDetail,
    closeDetail,
  } = useOrders();

  const [newOrderOpen, setNewOrderOpen] = useState(false);

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner" />
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-error">
        <p>Something went wrong: {error}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="orders-page"
      id="admin-orders"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* ── Page Header ── */}
      <div className="orders-page-header">
        <div className="orders-page-header-left">
          <h1 className="orders-page-title">Order Management</h1>
          <p className="orders-page-subtitle">Track, manage, and process all customer orders.</p>
        </div>
        <div className="orders-page-header-actions">
          <motion.button
            className="orders-export-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => alert('Export feature coming soon.')}
          >
            <Download size={16} /> Export
          </motion.button>
          <motion.button
            className="orders-new-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setNewOrderOpen(true)}
          >
            <Plus size={16} /> New Order
          </motion.button>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <OrderStats stats={stats} />

      {/* ── Filters ── */}
      <OrderFilters
        search={search}
        onSearchChange={applySearch}
        statusFilter={statusFilter}
        onStatusChange={applyStatusFilter}
        dateRange={dateRange}
        onDateChange={applyDateRange}
      />

      {/* ── Orders Table ── */}
      <OrdersTable
        orders={orders}
        total={total}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        canPrev={canPrev}
        canNext={canNext}
        onPrev={goPrev}
        onNext={goNext}
        onViewOrder={openDetail}
      />

      {/* ── Order Detail Drawer ── */}
      <OrderDetailDrawer
        order={selectedOrder}
        isOpen={detailOpen}
        onClose={closeDetail}
      />

      {/* ── New Order Modal ── */}
      <NewOrderModal
        isOpen={newOrderOpen}
        onClose={() => setNewOrderOpen(false)}
      />
    </motion.div>
  );
}
