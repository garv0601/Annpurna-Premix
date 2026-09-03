import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import './NewOrderModal.css';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 28 } },
};

/**
 * Placeholder modal for creating a new order.
 * Full workflow to be built later.
 */
export default function NewOrderModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="nom-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
          <motion.div
            className="nom-modal"
            id="new-order-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="nom-header">
              <h3>Create New Order</h3>
              <button className="nom-close" onClick={onClose} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="nom-body">
              <div className="nom-placeholder">
                <div className="nom-placeholder-icon">
                  <ShoppingBag size={32} />
                </div>
                <h4>Manual Order Creation</h4>
                <p>This feature is coming soon. You'll be able to create orders on behalf of customers, select products, apply coupons, and choose payment methods.</p>
              </div>
            </div>
            <div className="nom-footer">
              <button className="nom-cancel-btn" onClick={onClose}>Close</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
