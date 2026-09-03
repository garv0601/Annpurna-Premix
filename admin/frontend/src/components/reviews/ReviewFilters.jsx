import React from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Star } from 'lucide-react';
import '../customers/CustomerFilters.css'; // Reusing CSS

const STATUS_OPTIONS = [
  { value: '', label: 'All Reviews' },
  { value: 'approved', label: 'Approved' },
  { value: 'pending', label: 'Pending' },
  { value: 'rejected', label: 'Rejected' },
];

const RATING_OPTIONS = [
  { value: '', label: 'All Ratings' },
  { value: '5', label: '5 Stars' },
  { value: '4', label: '4 Stars' },
  { value: '3', label: '3 Stars' },
  { value: '2', label: '2 Stars' },
  { value: '1', label: '1 Star' },
];

export default function ReviewFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  ratingFilter,
  onRatingChange,
}) {
  return (
    <motion.div
      className="customer-filters"
      id="review-filters"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
    >
      <div className="cf-search">
        <Search size={18} className="cf-search-icon" />
        <input
          type="text"
          placeholder="Search reviews, products, or customers..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="cf-search-input"
        />
      </div>

      <div className="cf-actions">
        <div className="cf-select-wrap">
          <Star size={15} className="cf-select-icon" />
          <select
            value={ratingFilter}
            onChange={(e) => onRatingChange(e.target.value)}
            className="cf-select"
          >
            {RATING_OPTIONS.map((opt) => (
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
