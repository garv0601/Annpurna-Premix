import React from 'react';
import './CouponStatusBadge.css';

export default function CouponStatusBadge({ status }) {
  let className = '';
  let label = '';

  switch (status) {
    case 'active':
      className = 'cbadge-active';
      label = 'Active';
      break;
    case 'expired':
      className = 'cbadge-expired';
      label = 'Expired';
      break;
    case 'scheduled':
      className = 'cbadge-scheduled';
      label = 'Scheduled';
      break;
    default:
      className = 'cbadge-inactive';
      label = 'Unknown';
  }

  return (
    <span className={`cbadge ${className}`}>
      <span className="cbadge-dot" />
      {label}
    </span>
  );
}
