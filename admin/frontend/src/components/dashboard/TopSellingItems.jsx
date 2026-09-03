import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Package } from 'lucide-react';
import './TopSellingItems.css';

/**
 * Top selling products card for the dashboard.
 */
export default function TopSellingItems({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <motion.div
      className="top-selling-card"
      id="top-selling-items"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="top-selling-header">
        <h3>Top Selling Items</h3>
        <TrendingUp size={18} className="top-selling-header-icon" />
      </div>

      <ul className="top-selling-list">
        {products.map((product, index) => (
          <motion.li
            key={product.id}
            className="top-selling-item"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.55 + index * 0.1 }}
          >
            <div className="top-selling-product-img">
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="top-selling-placeholder">
                  <Package size={20} />
                </div>
              )}
              <span className="top-selling-rank">#{index + 1}</span>
            </div>
            <div className="top-selling-info">
              <p className="top-selling-name">{product.name}</p>
              <p className="top-selling-meta">
                ₹{product.price} <span className="meta-separator">•</span> {product.sold} sold
              </p>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
