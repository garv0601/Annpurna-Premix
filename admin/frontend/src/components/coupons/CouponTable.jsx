import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Ticket, Calendar, Percent, IndianRupee } from 'lucide-react';
import CouponStatusBadge from './CouponStatusBadge';
import '../customers/CustomerTable.css'; // Reuse table layout CSS
import './CouponTable.css'; // Minor coupon-specific additions

function formatDate(iso) {
  if (!iso) return 'No Expiry';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function CouponTable({ coupons, onEdit }) {
  if (!coupons || coupons.length === 0) {
    return (
      <div className="ctable-empty">
        <Ticket size={36} />
        <p>No coupons found matching your filters.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="ctable-card"
      id="coupon-list"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* ── Desktop Table ── */}
      <div className="ctable-scroll">
        <table className="ctable">
          <thead>
            <tr>
              <th>Coupon Code</th>
              <th>Type & Value</th>
              <th>Usage</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coup, idx) => {
              const usageLimitStr = coup.usage_limit ? coup.usage_limit : 'Unlimited';
              const progressPct = coup.usage_limit ? Math.min((coup.usage_count / coup.usage_limit) * 100, 100) : 0;
              
              return (
                <motion.tr
                  key={coup.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: 0.25 + idx * 0.04 }}
                >
                  <td>
                    <span className="coup-code-badge">{coup.code}</span>
                  </td>
                  <td>
                    <div className="ctable-contact">
                      <span className="ctable-email">
                        {coup.discount_type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                      </span>
                      <span className="ctable-phone">
                        {coup.discount_type === 'percentage' ? `${coup.discount_value}% off` : `₹${coup.discount_value} off`}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="coup-usage-cell">
                      <span className="ctable-metric">{coup.usage_count} / {usageLimitStr}</span>
                      {coup.usage_limit && (
                        <div className="coup-progress-bar">
                          <div className="coup-progress-fill" style={{ width: `${progressPct}%` }} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="ctable-date">{formatDate(coup.expiry_date)}</span>
                  </td>
                  <td>
                    <CouponStatusBadge status={coup.status} />
                  </td>
                  <td>
                    <motion.button
                      className="ctable-action-btn"
                      onClick={() => onEdit(coup)}
                      title="Edit Coupon"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit2 size={15} strokeWidth={2} />
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
        {coupons.map((coup, idx) => {
          const usageLimitStr = coup.usage_limit ? coup.usage_limit : 'Unlimited';
          return (
            <motion.div
              key={coup.id}
              className="ctable-mobile-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.25 + idx * 0.05 }}
            >
              <div className="cmc-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="coup-code-badge">{coup.code}</span>
                <CouponStatusBadge status={coup.status} />
              </div>

              <div className="cmc-body">
                <div className="cmc-contact-row">
                  {coup.discount_type === 'percentage' ? <Percent size={13} /> : <IndianRupee size={13} />}
                  {coup.discount_type === 'percentage' ? `${coup.discount_value}% off` : `₹${coup.discount_value} off`}
                </div>
                <div className="cmc-contact-row">
                  <Calendar size={13} /> Expires: {formatDate(coup.expiry_date)}
                </div>
                
                <div className="cmc-metrics-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="cmc-metric">
                    <span className="cmc-label">Usage ({coup.usage_count} / {usageLimitStr})</span>
                    {coup.usage_limit && (
                      <div className="coup-progress-bar" style={{ marginTop: '4px' }}>
                        <div className="coup-progress-fill" style={{ width: `${Math.min((coup.usage_count / coup.usage_limit) * 100, 100)}%` }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="cmc-footer">
                <motion.button
                  className="cmc-view-btn"
                  onClick={() => onEdit(coup)}
                  whileTap={{ scale: 0.97 }}
                >
                  <Edit2 size={14} /> Edit Coupon
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="ctable-pagination">
        <span className="cpag-info">Showing 1 to {coupons.length} of {coupons.length} entries</span>
        <div className="cpag-controls">
          <button className="cpag-btn" disabled>Prev</button>
          <button className="cpag-btn active">1</button>
          <button className="cpag-btn" disabled>Next</button>
        </div>
      </div>
    </motion.div>
  );
}
