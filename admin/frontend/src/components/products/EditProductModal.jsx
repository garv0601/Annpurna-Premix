import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ImagePlus, CheckCircle2 } from 'lucide-react';
import './ProductFormModal.css';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, x: '-50%', y: '-45%' },
  visible: { opacity: 1, scale: 1, x: '-50%', y: '-50%', transition: { type: 'spring', stiffness: 350, damping: 28 } },
};

/**
 * Modal for editing an existing product.
 * Categories are fetched from Supabase and passed via the `categories` prop.
 */
export default function EditProductModal({ product, isOpen, onClose, onSubmit, categories = [] }) {
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category_id: '',
    description: '',
    short_description: '',
    price: '',
    compare_at_price: '',
    stock_quantity: '',
    weight: '',
    servings: '',
    image_url: '',
    is_active: true,
    is_featured: false,
    is_bestseller: false,
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [errors, setErrors] = useState({});

  // Populate form when product changes
  useEffect(() => {
    if (product && isOpen) {
      setForm({
        name: product.name || '',
        sku: product.sku || '',
        category_id: product.category_id || '',
        description: product.description || '',
        short_description: product.short_description || '',
        price: product.price?.toString() || '',
        compare_at_price: product.compare_at_price?.toString() || '',
        stock_quantity: product.stock_quantity?.toString() || '',
        weight: product.weight?.toString() || '',
        servings: product.servings?.toString() || '',
        image_url: product.image_url || '',
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
        is_bestseller: product.is_bestseller ?? false,
      });
      setErrors({});
      setSubmitError(null);
      setSaveSuccess(false);
      setSubmitting(false);
    }
  }, [product, isOpen]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
    if (submitError) setSubmitError(null);
  };

  const handleToggle = (field) => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Product name is required';
    if (!form.sku.trim()) newErrors.sku = 'SKU is required';
    if (!form.category_id) newErrors.category_id = 'Category is required';
    
    const priceVal = parseFloat(form.price);
    if (isNaN(priceVal) || priceVal <= 0) newErrors.price = 'Valid positive price required';
    
    const stockVal = parseInt(form.stock_quantity, 10);
    if (isNaN(stockVal) || stockVal < 0) newErrors.stock_quantity = 'Valid non-negative stock required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product || !validate()) return;

    setSubmitting(true);
    const result = await onSubmit(product.id, {
      ...form,
      price: parseFloat(form.price) || 0,
      compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
      stock_quantity: parseInt(form.stock_quantity, 10) || 0,
      weight: form.weight || null,
      servings: form.servings || null,
      category_id: form.category_id || null,
    });
    
    setSubmitting(false);
    if (result?.success) {
      setSaveSuccess(true);
      setSubmitError(null);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1500);
    } else {
      setSubmitError(result?.error || 'Failed to save changes. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && product && (
        <>
          <motion.div
            className="pfm-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
          <motion.div
            className="pfm-modal"
            id="edit-product-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="pfm-header">
              <h3>Edit Product</h3>
              <button className="pfm-close" onClick={onClose} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <form className="pfm-form" onSubmit={handleSubmit} noValidate>
              <div className="pfm-scroll-body">
                {/* Image URL */}
                <div className="pfm-field">
                  <label className="pfm-label">Image URL</label>
                  <input
                    className="pfm-input"
                    type="text"
                    value={form.image_url}
                    onChange={(e) => handleChange('image_url', e.target.value)}
                    placeholder="https://example.com/product-image.jpg"
                  />
                </div>

                <div className="pfm-field-row">
                  <div className="pfm-field">
                    <label className="pfm-label">Product Name *</label>
                    <input
                      className={`pfm-input ${errors.name ? 'pfm-error' : ''}`}
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="e.g. Classic Poha Mix"
                    />
                    {errors.name && <span className="pfm-error-text">{errors.name}</span>}
                  </div>
                  <div className="pfm-field">
                    <label className="pfm-label">SKU *</label>
                    <input
                      className={`pfm-input ${errors.sku ? 'pfm-error' : ''}`}
                      type="text"
                      value={form.sku}
                      onChange={(e) => handleChange('sku', e.target.value)}
                      placeholder="e.g. BRK-001"
                    />
                    {errors.sku && <span className="pfm-error-text">{errors.sku}</span>}
                  </div>
                </div>

                <div className="pfm-field-row">
                  <div className="pfm-field">
                    <label className="pfm-label">Category *</label>
                    <select
                      className={`pfm-select ${errors.category_id ? 'pfm-error' : ''}`}
                      value={form.category_id}
                      onChange={(e) => handleChange('category_id', e.target.value)}
                    >
                      {categories.length === 0 ? (
                        <option value="">No categories available</option>
                      ) : (
                        <>
                          <option value="">Select category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </>
                      )}
                    </select>
                    {errors.category_id && <span className="pfm-error-text">{errors.category_id}</span>}
                  </div>
                  <div className="pfm-field">
                    <label className="pfm-label">Price (₹) *</label>
                    <input
                      className={`pfm-input ${errors.price ? 'pfm-error' : ''}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                      placeholder="0.00"
                    />
                    {errors.price && <span className="pfm-error-text">{errors.price}</span>}
                  </div>
                </div>

                <div className="pfm-field-row">
                  <div className="pfm-field">
                    <label className="pfm-label">Compare at Price (₹)</label>
                    <input
                      className="pfm-input"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.compare_at_price}
                      onChange={(e) => handleChange('compare_at_price', e.target.value)}
                      placeholder="Original price"
                    />
                  </div>
                  <div className="pfm-field">
                    <label className="pfm-label">Stock Quantity *</label>
                    <input
                      className={`pfm-input ${errors.stock_quantity ? 'pfm-error' : ''}`}
                      type="number"
                      min="0"
                      value={form.stock_quantity}
                      onChange={(e) => handleChange('stock_quantity', e.target.value)}
                      placeholder="0"
                    />
                    {errors.stock_quantity && <span className="pfm-error-text">{errors.stock_quantity}</span>}
                  </div>
                </div>

                <div className="pfm-field-row">
                  <div className="pfm-field">
                    <label className="pfm-label">Weight</label>
                    <input
                      className="pfm-input"
                      type="text"
                      value={form.weight}
                      onChange={(e) => handleChange('weight', e.target.value)}
                      placeholder="e.g. 200g"
                    />
                  </div>
                  <div className="pfm-field">
                    <label className="pfm-label">Servings</label>
                    <input
                      className="pfm-input"
                      type="text"
                      value={form.servings}
                      onChange={(e) => handleChange('servings', e.target.value)}
                      placeholder="e.g. 4"
                    />
                  </div>
                </div>

                <div className="pfm-field">
                  <label className="pfm-label">Short Description</label>
                  <input
                    className="pfm-input"
                    type="text"
                    value={form.short_description}
                    onChange={(e) => handleChange('short_description', e.target.value)}
                    placeholder="Brief product tagline"
                  />
                </div>

                <div className="pfm-field">
                  <label className="pfm-label">Description</label>
                  <textarea
                    className="pfm-textarea"
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Full product description..."
                    rows={3}
                  />
                </div>

                {/* Toggles */}
                <div className="pfm-toggles-row">
                  <label className="pfm-toggle-label">
                    <input type="checkbox" checked={form.is_active} onChange={() => handleToggle('is_active')} />
                    <span>Active</span>
                  </label>
                  <label className="pfm-toggle-label">
                    <input type="checkbox" checked={form.is_featured} onChange={() => handleToggle('is_featured')} />
                    <span>Featured</span>
                  </label>
                  <label className="pfm-toggle-label">
                    <input type="checkbox" checked={form.is_bestseller} onChange={() => handleToggle('is_bestseller')} />
                    <span>Bestseller</span>
                  </label>
                </div>
              </div>

              <div className="pfm-footer">
                <AnimatePresence>
                  {saveSuccess && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#27AE60', fontSize: '13px', fontWeight: 600, marginRight: 'auto' }}
                    >
                      <CheckCircle2 size={16} /> Changes saved successfully
                    </motion.div>
                  )}
                  {submitError && !saveSuccess && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E74C3C', fontSize: '13px', fontWeight: 600, marginRight: 'auto' }}
                    >
                      <X size={16} /> {submitError}
                    </motion.div>
                  )}
                </AnimatePresence>
                <button type="button" className="pfm-cancel-btn" onClick={onClose} disabled={submitting || saveSuccess}>
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  className="pfm-submit-btn"
                  disabled={submitting || saveSuccess}
                  whileHover={!submitting && !saveSuccess ? { scale: 1.02 } : {}}
                  whileTap={!submitting && !saveSuccess ? { scale: 0.98 } : {}}
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
