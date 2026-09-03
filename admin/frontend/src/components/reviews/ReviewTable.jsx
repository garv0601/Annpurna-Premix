import React from 'react';
import { motion } from 'framer-motion';
import { Eye, MessageSquareOff } from 'lucide-react';
import ReviewStatusBadge from './ReviewStatusBadge';
import '../customers/CustomerTable.css'; // Reuse table layout CSS
import './ReviewTable.css'; // Review specific styles

function getInitials(name) {
  if (!name) return 'U';
  const parts = name.split(' ');
  if (parts.length > 1) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }
  return name.charAt(0).toUpperCase();
}

const StarRating = ({ rating }) => {
  return (
    <div className="rtable-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? 'rtable-star-filled' : 'rtable-star-empty'}>
          ★
        </span>
      ))}
    </div>
  );
};

export default function ReviewTable({ reviews, onView }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="ctable-empty">
        <MessageSquareOff size={36} />
        <p>No reviews found matching your filters.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="ctable-card"
      id="review-list"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* ── Desktop Table ── */}
      <div className="ctable-scroll">
        <table className="ctable">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th style={{ width: '35%' }}>Review</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((rev, idx) => (
              <motion.tr
                key={rev.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, delay: 0.25 + idx * 0.04 }}
              >
                <td>
                  <div className="ctable-customer-cell">
                    <div className="ctable-avatar rtable-avatar">
                      {rev.customer_avatar ? (
                        <img src={rev.customer_avatar} alt={rev.customer_name} />
                      ) : (
                        <span>{getInitials(rev.customer_name)}</span>
                      )}
                    </div>
                    <span className="ctable-name">{rev.customer_name}</span>
                  </div>
                </td>
                <td>
                  <span className="rtable-product">{rev.product_name}</span>
                </td>
                <td>
                  <div className="rtable-text-preview" title={rev.review_text}>
                    "{rev.review_text}"
                  </div>
                </td>
                <td>
                  <StarRating rating={rev.rating} />
                </td>
                <td>
                  <ReviewStatusBadge status={rev.status} />
                </td>
                <td>
                  <motion.button
                    className="ctable-action-btn"
                    onClick={() => onView(rev)}
                    title="Moderate Review"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye size={16} strokeWidth={2} />
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="ctable-mobile-cards">
        {reviews.map((rev, idx) => (
          <motion.div
            key={rev.id}
            className="ctable-mobile-card rtable-mobile-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.25 + idx * 0.05 }}
          >
            <div className="cmc-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="ctable-customer-cell">
                <div className="ctable-avatar rtable-avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                  <span>{getInitials(rev.customer_name)}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="ctable-name" style={{ fontSize: '13px' }}>{rev.customer_name}</span>
                  <span className="rtable-product" style={{ fontSize: '11px', color: 'var(--text-light)' }}>{rev.product_name}</span>
                </div>
              </div>
              <ReviewStatusBadge status={rev.status} />
            </div>

            <div className="cmc-body" style={{ gap: '8px' }}>
              <StarRating rating={rev.rating} />
              <div className="rtable-text-preview" style={{ whiteSpace: 'normal', fontStyle: 'italic', color: 'var(--text-body)' }}>
                "{rev.review_text}"
              </div>
            </div>

            <div className="cmc-footer">
              <motion.button
                className="cmc-view-btn"
                onClick={() => onView(rev)}
                whileTap={{ scale: 0.97 }}
              >
                <Eye size={14} /> Moderate
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="ctable-pagination">
        <span className="cpag-info">Showing 1 to {reviews.length} of {reviews.length} entries</span>
        <div className="cpag-controls">
          <button className="cpag-btn" disabled>Prev</button>
          <button className="cpag-btn active">1</button>
          <button className="cpag-btn" disabled>Next</button>
        </div>
      </div>
    </motion.div>
  );
}
