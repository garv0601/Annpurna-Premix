import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import './DeleteProductDialog.css';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 28 } },
};

/**
 * Delete confirmation dialog.
 */
export default function DeleteProductDialog({ product, isOpen, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {isOpen && product && (
        <>
          <motion.div
            className="dpd-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
          <motion.div
            className="dpd-dialog"
            id="delete-product-dialog"
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="dpd-icon-wrap">
              <AlertTriangle size={28} />
            </div>
            <h3 className="dpd-title">Delete Product?</h3>
            <p className="dpd-message">
              Are you sure you want to remove <strong>{product.name}</strong> from the catalog? This action cannot be undone.
            </p>
            <div className="dpd-actions">
              <button className="dpd-cancel" onClick={onClose}>Cancel</button>
              <motion.button
                className="dpd-confirm"
                onClick={onConfirm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Delete Product
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
