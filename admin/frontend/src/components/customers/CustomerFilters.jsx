import React from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Calendar } from 'lucide-react';
import './CustomerFilters.css';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const DATE_OPTIONS = [
  { value: '', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'last_90_days', label: 'Last 90 Days' },
  { value: 'this_year', label: 'This Year' },
];

/**
 * Search + filter bar for customer management.
 */
export default function CustomerFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateFilter,
  onDateChange,
}) {
  return (
    <motion.div
      className="customer-filters"
      id="customer-filters"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
    >
      <div className="cf-search">
        <Search size={18} className="cf-search-icon" />
        <input
          type="text"
          placeholder="Search customers by name, email, or phone..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="cf-search-input"
          id="customer-search-input"
        />
      </div>

      <div className="cf-actions">
        <div className="cf-select-wrap">
          <Calendar size={15} className="cf-select-icon" />
          <select
            value={dateFilter || ''}
            onChange={(e) => onDateChange?.(e.target.value)}
            className="cf-select"
            id="customer-date-filter"
          >
            {DATE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        
        <div className="cf-select-wrap">
          <SlidersHorizontal size={15} className="cf-select-icon" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="cf-select"
            id="customer-status-filter"
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
