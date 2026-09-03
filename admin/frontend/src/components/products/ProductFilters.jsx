import React from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import './ProductFilters.css';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'in_stock', label: 'In Stock' },
  { value: 'low_stock', label: 'Low Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
  { value: 'inactive', label: 'Inactive' },
];

/**
 * Search + filter bar for product management.
 * Categories are now fetched from Supabase instead of hardcoded.
 */
export default function ProductFilters({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  categories = [],
}) {
  return (
    <motion.div
      className="product-filters"
      id="product-filters"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
    >
      <div className="pf-search">
        <Search size={18} className="pf-search-icon" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pf-search-input"
          id="product-search-input"
        />
      </div>

      <div className="pf-selects">
        <div className="pf-select-wrap">
          <SlidersHorizontal size={15} className="pf-select-icon" />
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="pf-select"
            id="product-category-filter"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="pf-select-wrap">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="pf-select"
            id="product-status-filter"
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
