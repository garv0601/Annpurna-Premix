import React from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Tag } from 'lucide-react';
import '../customers/CustomerFilters.css'; // Reusing CSS

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'scheduled', label: 'Scheduled' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'percentage', label: 'Percentage' },
  { value: 'fixed', label: 'Fixed Amount' },
];

export default function CouponFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
}) {
  return (
    <motion.div
      className="customer-filters"
      id="coupon-filters"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
    >
      <div className="cf-search">
        <Search size={18} className="cf-search-icon" />
        <input
          type="text"
          placeholder="Search coupon code..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="cf-search-input"
        />
      </div>

      <div className="cf-actions">
        <div className="cf-select-wrap">
          <Tag size={15} className="cf-select-icon" />
          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            className="cf-select"
          >
            {TYPE_OPTIONS.map((opt) => (
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
