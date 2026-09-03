import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';
import './CouponFormModal.css';

const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, x: '-50%', y: '-45%' },
  visible: { opacity: 1, scale: 1, x: '-50%', y: '-50%', transition: { type: 'spring', stiffness: 350, damping: 28 } },
};

export default function EditCouponModal({ coupon, isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    min_order_amount: '',
    max_discount: '',
    usage_limit: '',
    start_date: '',
    expiry_date: '',
    status: 'active',
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (coupon && isOpen) {
      setForm({
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        min_order_amount: coupon.min_order_amount || '',
        max_discount: coupon.max_discount || '',
        usage_limit: coupon.usage_limit || '',
        start_date: coupon.start_date ? coupon.start_date.split('T')[0] : '',
        expiry_date: coupon.expiry_date ? coupon.expiry_date.split('T')[0] : '',
        status: coupon.status,
      });
      setErrors({});
      setSaveSuccess(false);
    }
  }, [coupon, isOpen]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.code.trim()) newErrors.code = 'Coupon code is required';
    if (!form.discount_value || isNaN(form.discount_value) || form.discount_value <= 0) {
      newErrors.discount_value = 'Valid value required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coupon || !validate()) return;
    setSubmitting(true);
    
    const result = await onSubmit(coupon.id, {
      ...form,
      start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
      expiry_date: form.expiry_date ? new Date(form.expiry_date).toISOString() : null,
    });
    
    setSubmitting(false);
    if (result?.success) {
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && coupon && (
        <>
          <motion.div className="cpm-overlay" variants={overlayVariants} initial="hidden" animate="visible" exit="hidden" onClick={onClose} />
          <motion.div className="cpm-modal" variants={modalVariants} initial="hidden" animate="visible" exit="hidden">
            <div className="cpm-header">
              <h3>Edit Coupon</h3>
              <button className="cpm-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
            </div>

            <form className="cpm-form" onSubmit={handleSubmit} noValidate>
              <div className="cpm-scroll-body">
                <div className="cpm-field-row">
                  <div className="cpm-field">
                    <label className="cpm-label">Coupon Code *</label>
                    <input className={`cpm-input ${errors.code ? 'cpm-error' : ''}`} type="text" value={form.code} onChange={(e) => handleChange('code', e.target.value.toUpperCase())} />
                    {errors.code && <span className="cpm-error-text">{errors.code}</span>}
                  </div>
                  <div className="cpm-field">
                    <label className="cpm-label">Status</label>
                    <select className="cpm-select" value={form.status} onChange={(e) => handleChange('status', e.target.value)}>
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </div>
                </div>

                <div className="cpm-field-row">
                  <div className="cpm-field">
                    <label className="cpm-label">Discount Type</label>
                    <select className="cpm-select" value={form.discount_type} onChange={(e) => handleChange('discount_type', e.target.value)}>
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div className="cpm-field">
                    <label className="cpm-label">Discount Value *</label>
                    <input className={`cpm-input ${errors.discount_value ? 'cpm-error' : ''}`} type="number" min="0" step="0.01" value={form.discount_value} onChange={(e) => handleChange('discount_value', e.target.value)} />
                    {errors.discount_value && <span className="cpm-error-text">{errors.discount_value}</span>}
                  </div>
                </div>

                <div className="cpm-field-row">
                  <div className="cpm-field">
                    <label className="cpm-label">Min Order Amount</label>
                    <input className="cpm-input" type="number" min="0" value={form.min_order_amount} onChange={(e) => handleChange('min_order_amount', e.target.value)} />
                  </div>
                  <div className="cpm-field">
                    <label className="cpm-label">Max Discount</label>
                    <input className="cpm-input" type="number" min="0" value={form.max_discount} onChange={(e) => handleChange('max_discount', e.target.value)} disabled={form.discount_type === 'fixed'} />
                  </div>
                </div>

                <div className="cpm-field-row">
                  <div className="cpm-field">
                    <label className="cpm-label">Usage Limit (Total)</label>
                    <input className="cpm-input" type="number" min="1" value={form.usage_limit} onChange={(e) => handleChange('usage_limit', e.target.value)} />
                  </div>
                </div>

                <div className="cpm-field-row">
                  <div className="cpm-field">
                    <label className="cpm-label">Start Date</label>
                    <input className="cpm-input" type="date" value={form.start_date} onChange={(e) => handleChange('start_date', e.target.value)} />
                  </div>
                  <div className="cpm-field">
                    <label className="cpm-label">Expiry Date</label>
                    <input className="cpm-input" type="date" value={form.expiry_date} onChange={(e) => handleChange('expiry_date', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="cpm-footer">
                <AnimatePresence>
                  {saveSuccess && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#27AE60', fontSize: '13px', fontWeight: 600, marginRight: 'auto' }}>
                      <CheckCircle2 size={16} /> Saved successfully
                    </motion.div>
                  )}
                </AnimatePresence>
                <button type="button" className="cpm-cancel-btn" onClick={onClose} disabled={submitting || saveSuccess}>Cancel</button>
                <motion.button type="submit" className="cpm-submit-btn" disabled={submitting || saveSuccess} whileHover={!submitting && !saveSuccess ? { scale: 1.02 } : {}} whileTap={!submitting && !saveSuccess ? { scale: 0.98 } : {}}>
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
