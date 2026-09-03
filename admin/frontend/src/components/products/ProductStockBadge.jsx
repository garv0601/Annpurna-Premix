import React from 'react';
import './ProductStockBadge.css';

const STATUS_CONFIG = {
  in_stock:     { label: 'In Stock',      className: 'pstock-in' },
  low_stock:    { label: 'Low Stock',     className: 'pstock-low' },
  out_of_stock: { label: 'Out of Stock',  className: 'pstock-out' },
  inactive:     { label: 'Inactive',      className: 'pstock-inactive' },
};

/**
 * Reusable product stock status badge.
 * Optionally shows quantity alongside the label.
 */
export default function ProductStockBadge({ status, quantity }) {
  const config = STATUS_CONFIG[status] || { label: status, className: '' };
  const showQty = typeof quantity === 'number' && status !== 'inactive';

  return (
    <span className={`pstock-badge ${config.className}`}>
      <span className="pstock-dot" />
      {config.label}
      {showQty && <span className="pstock-qty">({quantity})</span>}
    </span>
  );
}
