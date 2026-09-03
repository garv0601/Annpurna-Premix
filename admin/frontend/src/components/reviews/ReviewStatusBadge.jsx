import React from 'react';
import './ReviewStatusBadge.css';

export default function ReviewStatusBadge({ status }) {
  let className = '';
  let label = '';

  switch (status) {
    case 'approved':
      className = 'rbadge-approved';
      label = 'Approved';
      break;
    case 'rejected':
      className = 'rbadge-rejected';
      label = 'Rejected';
      break;
    case 'pending':
    default:
      className = 'rbadge-pending';
      label = 'Pending';
  }

  return (
    <span className={`rbadge ${className}`}>
      <span className="rbadge-dot" />
      {label}
    </span>
  );
}
