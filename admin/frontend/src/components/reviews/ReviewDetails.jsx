import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Trash2, Ban } from 'lucide-react';
import ReviewStatusBadge from './ReviewStatusBadge';
import '../customers/CustomerDetails.css'; // Reusing Drawer CSS structure

const drawerVariants = {
  hidden: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  visible: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

const StarRating = ({ rating }) => {
  return (
    <div style={{ display: 'flex', gap: '2px', fontSize: '18px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} style={{ color: star <= rating ? '#FFC300' : '#E0E0E0' }}>★</span>
      ))}
    </div>
  );
};

export default function ReviewDetails({ review, isOpen, onClose, onStatusChange, onDelete, actionLoading }) {
  if (!review) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="cd-overlay" variants={overlayVariants} initial="hidden" animate="visible" exit="hidden" onClick={onClose} />
          <motion.aside className="cd-drawer" variants={drawerVariants} initial="hidden" animate="visible" exit="hidden">
            
            <div className="cd-header">
              <h3 className="cd-title">Review Details</h3>
              <button className="cd-close" onClick={onClose} aria-label="Close"><X size={20} /></button>
            </div>

            <div className="cd-body">
              <div className="cd-section" style={{ borderBottom: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <ReviewStatusBadge status={review.status} />
                  <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>{formatDate(review.created_at)}</span>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <StarRating rating={review.rating} />
                </div>

                <div style={{ backgroundColor: 'var(--bg-page)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
                  <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
                    "{review.review_text}"
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Product</span>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-heading)' }}>{review.product_name}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Customer</span>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-heading)' }}>{review.customer_name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Moderation Actions Footer */}
            <div style={{ padding: '20px 22px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {review.status === 'pending' && (
                <>
                  <motion.button
                    disabled={actionLoading}
                    onClick={() => onStatusChange(review.id, 'approved')}
                    whileTap={{ scale: 0.98 }}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: '#27AE60', color: 'white', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                  >
                    <Check size={18} /> Approve Review
                  </motion.button>
                  <motion.button
                    disabled={actionLoading}
                    onClick={() => onStatusChange(review.id, 'rejected')}
                    whileTap={{ scale: 0.98 }}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'var(--bg-page)', color: '#C0392B', border: '1px solid var(--border-color)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                  >
                    <Ban size={18} /> Reject
                  </motion.button>
                </>
              )}

              {review.status === 'approved' && (
                <>
                  <motion.button
                    disabled={actionLoading}
                    onClick={() => onStatusChange(review.id, 'rejected')}
                    whileTap={{ scale: 0.98 }}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'var(--bg-page)', color: '#C0392B', border: '1px solid var(--border-color)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                  >
                    <Ban size={18} /> Revoke Approval
                  </motion.button>
                </>
              )}

              {review.status === 'rejected' && (
                <>
                  <motion.button
                    disabled={actionLoading}
                    onClick={() => onStatusChange(review.id, 'approved')}
                    whileTap={{ scale: 0.98 }}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: '#27AE60', color: 'white', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                  >
                    <Check size={18} /> Re-Approve
                  </motion.button>
                </>
              )}

              <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }} />

              <motion.button
                disabled={actionLoading}
                onClick={() => onDelete(review.id)}
                whileTap={{ scale: 0.98 }}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'transparent', color: 'var(--text-muted)', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <Trash2 size={18} /> Delete Permanently
              </motion.button>

            </div>

          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
