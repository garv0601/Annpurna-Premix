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
export default function OrderStatusBadge({ status, onClick, ariaLabel }) {
  const config = STATUS_CONFIG[status] || { label: status, className: '' };
  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      className={`order-badge ${onClick ? 'order-badge-clickable' : ''} ${config.className}`}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
      aria-label={ariaLabel}
    >
      <span className="order-badge-dot" />
      {config.label}
    </Component>
  );
}
