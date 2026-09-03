import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';
import './CustomerFormModal.css';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, x: '-50%', y: '-45%' },
  visible: { opacity: 1, scale: 1, x: '-50%', y: '-50%', transition: { type: 'spring', stiffness: 350, damping: 28 } },
};

const INITIAL_FORM = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  status: 'active',
};

/**
 * Modal for adding a new customer manually.
 */
export default function AddCustomerModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Valid email is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const result = await onSubmit(form);
    setSubmitting(false);

    if (result?.success) {
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setForm({ ...INITIAL_FORM });
        onClose();
      }, 1500);
    }
  };

  const handleClose = () => {
    setForm({ ...INITIAL_FORM });
    setErrors({});
    setSaveSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="cfm-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={handleClose}
          />
          <motion.div
            className="cfm-modal"
            id="add-customer-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="cfm-header">
              <h3>Add New Customer</h3>
              <button className="cfm-close" onClick={handleClose} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <form className="cfm-form" onSubmit={handleSubmit} noValidate>
              <div className="cfm-scroll-body">
                
                <div className="cfm-field-row">
                  <div className="cfm-field">
                    <label className="cfm-label">First Name *</label>
                    <input
                      className={`cfm-input ${errors.first_name ? 'cfm-error' : ''}`}
                      type="text"
                      value={form.first_name}
                      onChange={(e) => handleChange('first_name', e.target.value)}
                      placeholder="e.g. Aarti"
                    />
                    {errors.first_name && <span className="cfm-error-text">{errors.first_name}</span>}
                  </div>
                  <div className="cfm-field">
                    <label className="cfm-label">Last Name</label>
                    <input
                      className="cfm-input"
                      type="text"
                      value={form.last_name}
                      onChange={(e) => handleChange('last_name', e.target.value)}
                      placeholder="e.g. Sharma"
                    />
                  </div>
                </div>

                <div className="cfm-field">
                  <label className="cfm-label">Email Address *</label>
                  <input
                    className={`cfm-input ${errors.email ? 'cfm-error' : ''}`}
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="aarti@example.com"
                  />
                  {errors.email && <span className="cfm-error-text">{errors.email}</span>}
                </div>

                <div className="cfm-field-row">
                  <div className="cfm-field">
                    <label className="cfm-label">Phone Number *</label>
                    <input
                      className={`cfm-input ${errors.phone ? 'cfm-error' : ''}`}
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <span className="cfm-error-text">{errors.phone}</span>}
                  </div>
                  <div className="cfm-field">
                    <label className="cfm-label">Account Status</label>
                    <select
                      className="cfm-select"
                      value={form.status}
                      onChange={(e) => handleChange('status', e.target.value)}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>

              <div className="cfm-footer">
                <AnimatePresence>
                  {saveSuccess && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#27AE60', fontSize: '13px', fontWeight: 600, marginRight: 'auto' }}
                    >
                      <CheckCircle2 size={16} /> Customer created successfully
                    </motion.div>
                  )}
                </AnimatePresence>
                <button type="button" className="cfm-cancel-btn" onClick={handleClose} disabled={submitting || saveSuccess}>
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  className="cfm-submit-btn"
                  disabled={submitting || saveSuccess}
                  whileHover={!submitting && !saveSuccess ? { scale: 1.02 } : {}}
                  whileTap={!submitting && !saveSuccess ? { scale: 0.98 } : {}}
                >
                  {submitting ? 'Creating...' : 'Create Customer'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
