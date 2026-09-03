import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Eye, Pencil, Trash2, Package } from 'lucide-react';
import ProductStockBadge from './ProductStockBadge';
import './ProductList.css';

/**
 * Product list — desktop rows with mobile card fallback.
 * Category names are populated from the Supabase join (product.category).
 */

// ─────────────────────────────────────────────────────────────────
// VISIBILITY TOGGLE
// A compact toggle switch + inline feedback label for each product.
// ─────────────────────────────────────────────────────────────────
function VisibilityToggle({ productId, isActive, onToggle }) {
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'ok' | 'err'

  const handleChange = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    setFeedback(null);

    const result = await onToggle(productId, !isActive);

    if (result?.success === false) {
      setFeedback('err');
    } else {
      setFeedback('ok');
    }

    setBusy(false);
    setTimeout(() => setFeedback(null), 1800);
  }, [busy, productId, isActive, onToggle]);

  return (
    <div className="plist-visibility-cell" aria-label={`Product visibility: ${isActive ? 'visible' : 'hidden'}`}>
      <label className="plist-toggle-label" title={isActive ? 'Visible to customers — click to hide' : 'Hidden from customers — click to show'}>
        <input
          type="checkbox"
          className="plist-toggle-input"
          checked={!!isActive}
          onChange={handleChange}
          disabled={busy}
          aria-label="Visible to customers"
        />
        <span className={`plist-toggle-track${busy ? ' plist-toggle-busy' : ''}`}>
          <span className="plist-toggle-thumb" />
        </span>
      </label>
      {feedback === 'ok' && (
        <span className="plist-vis-feedback plist-vis-ok" aria-live="polite">✓</span>
      )}
      {feedback === 'err' && (
        <span className="plist-vis-feedback plist-vis-err" aria-live="polite">✗ failed</span>
      )}
    </div>
  );
}

/**
 * Product list — desktop rows with mobile card fallback.
 */
export default function ProductList({ products, onView, onEdit, onDelete, onToggleVisibility }) {
  if (!products || products.length === 0) {
    return (
      <div className="plist-empty">
        <Package size={36} />
        <p>No products found matching your filters.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="plist-card"
      id="product-list"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* ── Desktop/Tablet Table ── */}
      <div className="plist-table-scroll">
        <table className="plist-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Visible</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, delay: 0.25 + idx * 0.04 }}
              >
                <td>
                  <div className="plist-product-cell">
                    <div className="plist-product-img">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} />
                      ) : (
                        <div className="plist-product-placeholder">
                          <Package size={20} />
                        </div>
                      )}
                    </div>
                    <span className="plist-product-name">{product.name}</span>
                  </div>
                </td>
                <td>
                  <span className="plist-sku">{product.sku}</span>
                </td>
                <td>
                  <span className="plist-category">
                    {product.category || '—'}
                  </span>
                </td>
                <td>
                  <span className="plist-price">₹{Number(product.price).toFixed(2)}</span>
                </td>
                <td>
                  <ProductStockBadge
                    status={product.status}
                    quantity={product.stock_quantity}
                  />
                </td>
                <td>
                  <VisibilityToggle
                    productId={product.id}
                    isActive={product.is_active}
                    onToggle={onToggleVisibility}
                  />
                </td>
                <td>
                  <div className="plist-actions">
                    <motion.button
                      className="plist-action-btn plist-view-btn"
                      onClick={() => onView(product.id)}
                      aria-label={`View ${product.name}`}
                      title="View"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Eye size={15} strokeWidth={1.8} />
                    </motion.button>
                    <motion.button
                      className="plist-action-btn plist-edit-btn"
                      onClick={() => onEdit(product.id)}
                      aria-label={`Edit ${product.name}`}
                      title="Edit"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Pencil size={15} strokeWidth={1.8} />
                    </motion.button>
                    <motion.button
                      className="plist-action-btn plist-delete-btn"
                      onClick={() => onDelete(product)}
                      aria-label={`Delete ${product.name}`}
                      title="Delete"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={15} strokeWidth={1.8} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="plist-mobile-cards">
        {products.map((product, idx) => (
          <motion.div
            key={product.id}
            className="plist-mobile-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.25 + idx * 0.05 }}
          >
            <div className="pmc-top">
              <div className="plist-product-cell">
                <div className="plist-product-img">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} />
                  ) : (
                    <div className="plist-product-placeholder">
                      <Package size={18} />
                    </div>
                  )}
                </div>
                <div className="pmc-top-info">
                  <span className="plist-product-name">{product.name}</span>
                  <span className="plist-sku">{product.sku}</span>
                </div>
              </div>
              <ProductStockBadge
                status={product.status}
                quantity={product.stock_quantity}
              />
            </div>
            <div className="pmc-body">
              <div className="pmc-row">
                <span className="pmc-label">Category</span>
                <span className="plist-category">
                  {product.category || '—'}
                </span>
              </div>
              <div className="pmc-row">
                <span className="pmc-label">Price</span>
                <span className="plist-price">₹{Number(product.price).toFixed(2)}</span>
              </div>
              <div className="pmc-row">
                <span className="pmc-label">Visible to Customers</span>
                <VisibilityToggle
                  productId={product.id}
                  isActive={product.is_active}
                  onToggle={onToggleVisibility}
                />
              </div>
            </div>
            <div className="pmc-footer">
              <motion.button
                className="pmc-action-btn pmc-view"
                onClick={() => onView(product.id)}
                whileTap={{ scale: 0.97 }}
              >
                <Eye size={14} /> View
              </motion.button>
              <motion.button
                className="pmc-action-btn pmc-edit"
                onClick={() => onEdit(product.id)}
                whileTap={{ scale: 0.97 }}
              >
                <Pencil size={14} /> Edit
              </motion.button>
              <motion.button
                className="pmc-action-btn pmc-delete"
                onClick={() => onDelete(product)}
                whileTap={{ scale: 0.97 }}
              >
                <Trash2 size={14} /> Delete
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
