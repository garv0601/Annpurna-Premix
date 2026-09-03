import React from 'react';
import './OrderStatusBadge.css';

/**
 * Status pill configuration — maps order status to label + className.
 * All colors reference CSS custom properties in the stylesheet.
 */
const STATUS_CONFIG = {
  pending:          { label: 'Pending',          className: 'badge-pending' },
  confirmed:        { label: 'Confirmed',        className: 'badge-confirmed' },
  processing:       { label: 'Processing',       className: 'badge-processing' },
  shipped:          { label: 'Shipped',           className: 'badge-shipped' },
  out_for_delivery: { label: 'Out for Delivery',  className: 'badge-out-for-delivery' },
  delivered:        { label: 'Delivered',          className: 'badge-delivered' },
  cancelled:        { label: 'Cancelled',          className: 'badge-cancelled' },
  refunded:         { label: 'Refunded',           className: 'badge-refunded' },
};

/**
 * Reusable order status pill badge.
 */
export default function OrderStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, className: '' };

  return (
    <span className={`order-badge ${config.className}`}>
      <span className="order-badge-dot" />
      {config.label}
    </span>
  );
}
