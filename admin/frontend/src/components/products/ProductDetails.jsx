import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Calendar, Tag, Hash, Layers, Info, Weight, Users, Star, Zap } from 'lucide-react';
import ProductStockBadge from './ProductStockBadge';
import './ProductDetails.css';

const drawerVariants = {
  hidden: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  visible: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

/**
 * Product details slide-in drawer (view-only).
 */
export default function ProductDetails({ product, isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && product && (
        <>
          <motion.div
            className="pd-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
          <motion.aside
            className="pd-drawer"
            id="product-detail-drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Header */}
            <div className="pd-header">
              <div>
                <h3 className="pd-title">{product.name}</h3>
                <p className="pd-subtitle">{product.sku}</p>
              </div>
              <button className="pd-close" onClick={onClose} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className="pd-body">
              {/* Image */}
              <div className="pd-image-section">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="pd-image" />
                ) : (
                  <div className="pd-image-placeholder">
                    <Package size={40} />
                    <span>No image</span>
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="pd-status-row">
                <ProductStockBadge status={product.status} quantity={product.stock_quantity} />
                <span className="pd-price">₹{Number(product.price).toFixed(2)}</span>
              </div>

              {/* Badges row */}
              {(product.is_featured || product.is_bestseller) && (
                <div className="pd-badges-row">
                  {product.is_featured && <span className="pd-badge pd-badge-featured"><Star size={11} /> Featured</span>}
                  {product.is_bestseller && <span className="pd-badge pd-badge-bestseller"><Zap size={11} /> Bestseller</span>}
                </div>
              )}

              {/* Info Grid */}
              <div className="pd-section">
                <h4 className="pd-section-title"><Info size={15} /> Details</h4>
                <div className="pd-info-grid">
                  <div className="pd-info-item">
                    <span className="pd-info-label"><Hash size={12} /> SKU</span>
                    <span className="pd-info-value">{product.sku || '—'}</span>
                  </div>
                  <div className="pd-info-item">
                    <span className="pd-info-label"><Layers size={12} /> Category</span>
                    <span className="pd-info-value">
                      {product.category || '—'}
                    </span>
                  </div>
                  <div className="pd-info-item">
                    <span className="pd-info-label"><Tag size={12} /> Price</span>
                    <span className="pd-info-value pd-info-price">₹{Number(product.price).toFixed(2)}</span>
                  </div>
                  {product.compare_at_price && (
                    <div className="pd-info-item">
                      <span className="pd-info-label"><Tag size={12} /> Compare</span>
                      <span className="pd-info-value" style={{ textDecoration: 'line-through', color: 'var(--text-light)' }}>₹{Number(product.compare_at_price).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pd-info-item">
                    <span className="pd-info-label"><Package size={12} /> Stock</span>
                    <span className="pd-info-value">{product.stock_quantity} units</span>
                  </div>
                  {product.weight && (
                    <div className="pd-info-item">
                      <span className="pd-info-label"><Package size={12} /> Weight</span>
                      <span className="pd-info-value">{product.weight}</span>
                    </div>
                  )}
                  {product.servings && (
                    <div className="pd-info-item">
                      <span className="pd-info-label"><Users size={12} /> Servings</span>
                      <span className="pd-info-value">{product.servings}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Short Description */}
              {product.short_description && (
                <div className="pd-section">
                  <h4 className="pd-section-title">Summary</h4>
                  <p className="pd-description">{product.short_description}</p>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="pd-section">
                  <h4 className="pd-section-title">Description</h4>
                  <p className="pd-description">{product.description}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="pd-section pd-timestamps">
                <div className="pd-timestamp">
                  <Calendar size={13} />
                  <span>Created: {formatDate(product.created_at)}</span>
                </div>
                <div className="pd-timestamp">
                  <Calendar size={13} />
                  <span>Updated: {formatDate(product.updated_at)}</span>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
