import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ImagePlus, CheckCircle2, FileImage } from 'lucide-react';
import './ProductFormModal.css';
import {
  validateProductImageFile,
  uploadProductImage,
  deleteProductImageByPath,
  deleteProductImageByUrl,
  isManagedProductImageUrl,
  ALLOWED_IMAGE_HINT,
} from '../../utils/productImageUpload';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 28 } },
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

  // Gallery upload state — an uploaded file always takes priority over the Image URL field.
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const originalImageUrlRef = useRef('');

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
      originalImageUrlRef.current = product.image_url || '';
      setImageFile(null);
      setImagePreview(null);
      setImageError(null);
      setErrors({});
      setSubmitError(null);
      setSaveSuccess(false);
      setSubmitting(false);
    }
  }, [product, isOpen]);

  // Revoke the object URL preview when it changes or the modal unmounts, to avoid leaks.
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
    if (submitError) setSubmitError(null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    const { valid, error } = validateProductImageFile(file);
    if (!valid) {
      setImageError(error);
      return;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageError(null);
    if (submitError) setSubmitError(null);
  };

  // Removes the newly selected upload (reverting to the current Image URL),
  // or clears the image entirely if no new file was selected.
  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    setImageError(null);
    if (!imageFile) {
      handleChange('image_url', '');
    }
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

    // Gallery upload takes priority over the Image URL field. Upload first
    // so we never save a product referencing a broken/incomplete image.
    let finalImageUrl = form.image_url || '';
    let uploadedPath = null;

    if (imageFile) {
      setUploadingImage(true);
      try {
        const { publicUrl, path } = await uploadProductImage(imageFile, product.id);
        finalImageUrl = publicUrl;
        uploadedPath = path;
      } catch (err) {
        setUploadingImage(false);
        setSubmitting(false);
        setSubmitError(err.message || 'Unable to upload image. Please try again.');
        return;
      }
      setUploadingImage(false);
    }

    const result = await onSubmit(product.id, {
      ...form,
      image_url: finalImageUrl,
      price: parseFloat(form.price) || 0,
      compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
      stock_quantity: parseInt(form.stock_quantity, 10) || 0,
      weight: form.weight || null,
      servings: form.servings || null,
      category_id: form.category_id || null,
    });

    if (result?.success) {
      // Clean up the previous uploaded image only if it was replaced/removed
      // and it lived in our managed bucket (never touch external URLs).
      const previousUrl = originalImageUrlRef.current;
      if (previousUrl && previousUrl !== finalImageUrl && isManagedProductImageUrl(previousUrl)) {
        deleteProductImageByUrl(previousUrl);
      }
    } else if (uploadedPath) {
      // The update failed — don't leave an orphaned upload behind.
      deleteProductImageByPath(uploadedPath);
    }

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
                {/* Product Image — URL or gallery upload (upload takes priority) */}
                <div className="pfm-field">
                  <label className="pfm-label">Product Image</label>

                  <input
                    className="pfm-input"
                    type="text"
                    value={form.image_url}
                    onChange={(e) => handleChange('image_url', e.target.value)}
                    placeholder="https://example.com/product-image.jpg"
                    disabled={!!imageFile}
                  />

                  <div className="pfm-image-divider"><span>OR</span></div>

                  {!imagePreview && !form.image_url ? (
                    <label className="pfm-image-upload" htmlFor="edit-product-image-input">
                      <ImagePlus size={22} />
                      <span>Upload Image</span>
                      <p>{ALLOWED_IMAGE_HINT}</p>
                    </label>
                  ) : (
                    <div className="pfm-image-preview">
                      <img
                        src={imagePreview || form.image_url}
                        alt="Product preview"
                        className="pfm-image-preview-img"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      <div className="pfm-image-preview-info">
                        <span className="pfm-image-preview-name">
                          <FileImage size={14} /> {imageFile ? imageFile.name : 'Current image'}
                        </span>
                        <div className="pfm-image-preview-actions">
                          <button
                            type="button"
                            className="pfm-image-change-btn"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Change Image
                          </button>
                          <button type="button" className="pfm-image-remove-btn" onClick={handleRemoveImage}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    id="edit-product-image-input"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />

                  {imageError && <span className="pfm-error-text">{imageError}</span>}
                  {imageFile && form.image_url && !imageError && (
                    <p className="pfm-image-priority-note">The uploaded image will be used instead of the Image URL above.</p>
                  )}
                  {uploadingImage && <p className="pfm-image-uploading-note">Uploading image...</p>}
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
                  {uploadingImage ? 'Uploading image...' : submitting ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
