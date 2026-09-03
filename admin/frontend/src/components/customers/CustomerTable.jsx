import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Users, Phone, Mail } from 'lucide-react';
import CustomerStatusBadge from './CustomerStatusBadge';
import './CustomerTable.css';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function getInitials(first, last) {
  return `${(first || '').charAt(0)}${(last || '').charAt(0)}`.toUpperCase() || '?';
}

/**
 * Customer Table — desktop view with mobile card fallback.
 * Compatible with both full_name and first_name/last_name structures.
 */
export default function CustomerTable({ customers, onView }) {
  if (!customers || customers.length === 0) {
    return (
      <div className="ctable-empty">
        <Users size={36} />
        <p>No customers found matching your filters.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="ctable-card"
      id="customer-list"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* ── Desktop/Tablet Table ── */}
      <div className="ctable-scroll">
        <table className="ctable">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th>Total Orders</th>
              <th>Total Spent</th>
              <th>Last Order</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust, idx) => {
              const displayName = cust.full_name || `${cust.first_name || ''} ${cust.last_name || ''}`.trim();
              const totalSpent = Number(cust.total_spent) || 0;
              return (
                <motion.tr
                  key={cust.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: 0.25 + idx * 0.04 }}
                >
                  <td>
                    <div className="ctable-customer-cell">
                      <div className="ctable-avatar">
                        {cust.avatar_url ? (
                          <img src={cust.avatar_url} alt={displayName} />
                        ) : (
                          <span>{getInitials(cust.first_name, cust.last_name)}</span>
                        )}
                      </div>
                      <span className="ctable-name">{displayName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="ctable-contact">
                      <span className="ctable-email">{cust.email || '—'}</span>
                      <span className="ctable-phone">{cust.phone || '—'}</span>
                    </div>
                  </td>
                  <td>
                    <span className="ctable-metric">{cust.total_orders}</span>
                  </td>
                  <td>
                    <span className="ctable-metric">₹{totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </td>
                  <td>
                    <span className="ctable-date">{formatDate(cust.last_order_date)}</span>
                  </td>
                  <td>
                    <CustomerStatusBadge status={cust.status} />
                  </td>
                  <td>
                    <motion.button
                      className="ctable-action-btn"
                      onClick={() => onView(cust)}
                      aria-label={`View ${displayName}`}
                      title="View Details"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Eye size={16} strokeWidth={2} />
                    </motion.button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="ctable-mobile-cards">
        {customers.map((cust, idx) => {
          const displayName = cust.full_name || `${cust.first_name || ''} ${cust.last_name || ''}`.trim();
          const totalSpent = Number(cust.total_spent) || 0;
          return (
            <motion.div
              key={cust.id}
              className="ctable-mobile-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.25 + idx * 0.05 }}
            >
              <div className="cmc-top">
                <div className="ctable-customer-cell">
                  <div className="ctable-avatar">
                    {cust.avatar_url ? (
                      <img src={cust.avatar_url} alt={displayName} />
                    ) : (
                      <span>{getInitials(cust.first_name, cust.last_name)}</span>
                    )}
                  </div>
                  <div className="cmc-name-col">
                    <span className="ctable-name">{displayName}</span>
                    <CustomerStatusBadge status={cust.status} />
                  </div>
                </div>
              </div>

              <div className="cmc-body">
                <div className="cmc-contact-row">
                  <Mail size={13} /> {cust.email || '—'}
                </div>
                <div className="cmc-contact-row">
                  <Phone size={13} /> {cust.phone || '—'}
                </div>
                
                <div className="cmc-metrics-grid">
                  <div className="cmc-metric">
                    <span className="cmc-label">Orders</span>
                    <span className="cmc-value">{cust.total_orders}</span>
                  </div>
                  <div className="cmc-metric">
                    <span className="cmc-label">Spent</span>
                    <span className="cmc-value">₹{totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="cmc-metric">
                    <span className="cmc-label">Last Order</span>
                    <span className="cmc-value">{formatDate(cust.last_order_date)}</span>
                  </div>
                </div>
              </div>

              <div className="cmc-footer">
                <motion.button
                  className="cmc-view-btn"
                  onClick={() => onView(cust)}
                  whileTap={{ scale: 0.97 }}
                >
                  <Eye size={14} /> View Details
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* ── Pagination Footer ── */}
      <div className="ctable-pagination">
        <span className="cpag-info">Showing 1 to {customers.length} of {customers.length} entries</span>
        <div className="cpag-controls">
          <button className="cpag-btn" disabled>Prev</button>
          <button className="cpag-btn active">1</button>
          <button className="cpag-btn" disabled>Next</button>
        </div>
      </div>
    </motion.div>
  );
}
