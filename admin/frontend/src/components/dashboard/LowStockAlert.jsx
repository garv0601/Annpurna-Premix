import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import './LowStockAlert.css';

/**
 * Yellow alert card for low-stock products.
 */
export default function LowStockAlert({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <motion.div
      className="low-stock-card"
      id="low-stock-alert"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="low-stock-header">
        <div className="low-stock-icon-wrap">
          <AlertTriangle size={20} />
        </div>
        <h3>Low Stock Alert</h3>
      </div>

      <ul className="low-stock-list">
        {products.map((product) => (
          <li key={product.id} className="low-stock-item">
            <span className="low-stock-name">{product.name}</span>
            <span className="low-stock-count">
              Only <strong>{product.stock}</strong> left
            </span>
          </li>
        ))}
      </ul>

      <motion.button
        className="low-stock-btn"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Update Inventory
      </motion.button>
    </motion.div>
  );
}
