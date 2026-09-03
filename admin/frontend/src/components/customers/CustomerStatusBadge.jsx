import React from 'react';
import './CustomerStatusBadge.css';

/**
 * Reusable customer status badge (Active / Inactive)
 */
export default function CustomerStatusBadge({ status }) {
  const isInactive = status === 'inactive';
  const label = isInactive ? 'Inactive' : 'Active';
  const className = isInactive ? 'cbadge-inactive' : 'cbadge-active';

  return (
    <span className={`cbadge ${className}`}>
      <span className="cbadge-dot" />
      {label}
    </span>
  );
}
