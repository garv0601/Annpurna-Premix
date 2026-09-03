import React from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Filter } from 'lucide-react';
import './OrderFilters.css';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

const DATE_OPTIONS = [
  { value: '', label: 'Any Date' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
];

/**
 * Search + filter bar for orders.
 */
export default function OrderFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateRange,
  onDateChange,
}) {
  return (
    <motion.div
      className="order-filters"
      id="order-filters"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.25 }}
    >
      <div className="ofilter-search">
        <Search size={18} className="ofilter-search-icon" />
        <input
          type="text"
          placeholder="Search by Order ID, Customer or Phone..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="ofilter-search-input"
          id="order-search-input"
        />
      </div>

      <div className="ofilter-selects">
        <div className="ofilter-select-wrap">
          <Calendar size={15} className="ofilter-select-icon" />
          <select
            value={dateRange}
            onChange={(e) => onDateChange(e.target.value)}
            className="ofilter-select"
            id="order-date-filter"
          >
            {DATE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="ofilter-select-wrap">
          <Filter size={15} className="ofilter-select-icon" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="ofilter-select"
            id="order-status-filter"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
}
