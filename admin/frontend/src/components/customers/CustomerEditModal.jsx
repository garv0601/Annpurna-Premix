import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Mail, Phone, Calendar, Globe, Utensils, Flame, Bell, Trash2, ShieldAlert } from 'lucide-react';
import './CustomerEditModal.css';

const COMMUNICATION_LABELS = [
  { key: 'promotional_offers', label: 'Promotional Offers' },
  { key: 'new_product_notifications', label: 'New Product Notifications' },
  { key: 'email_notifications', label: 'Email Notifications' },
  { key: 'sms_notifications', label: 'SMS Notifications' },
  { key: 'whatsapp_notifications', label: 'WhatsApp Notifications' },
];

const DIETARY_LABELS = { vegetarian: 'Vegetarian', 'non-vegetarian': 'Non-Vegetarian' };
const SPICE_LABELS = { mild: 'Mild', medium: 'Medium', spicy: 'Spicy' };

const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 28 } },
};

function getInitials(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return `${(parts[0] || '').charAt(0)}${(parts[1] || '').charAt(0)}`.toUpperCase() || '?';
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Admin "Customer Details" popup.
 *
 * Strictly READ-ONLY — shows the customer's profile exactly as stored.
 * Nothing on this screen can be edited or changed (not even phone number).
 * The only action available is permanently deleting the customer.
 */
export default function CustomerEditModal({ isOpen, customer, loading, loadError, onClose, onDelete }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Reset the delete-confirmation state whenever a new customer is shown.
  useEffect(() => {
    setConfirmingDelete(false);
    setDeleting(false);
    setDeleteError('');
  }, [isOpen, customer?.id]);

  const displayName = useMemo(() => {
    if (!customer) return '';
    return customer.full_name || customer.email || 'Customer';
  }, [customer]);

  const status = (customer?.Status || 'active').toLowerCase();

  const handleClose = () => {
    if (deleting) return;
    onClose();
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError('');
    const result = await onDelete(customer.id);
    setDeleting(false);
    if (result?.success) {
      onClose();
    } else {
      setDeleteError(result?.error || 'Unable to delete customer. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="cem-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={handleClose}
          />
          <div className="cem-modal-wrap">
            <motion.div
              className="cem-modal"
              id="customer-details-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="customer-details-title"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="cem-header">
                <h3 className="cem-title" id="customer-details-title">Customer Details</h3>
                <button className="cem-close" onClick={handleClose} aria-label="Close" disabled={deleting}>
                  <X size={20} />
                </button>
              </div>

              <div className="cem-body">
                {loading ? (
                  <div className="cem-loading">
                    <div className="loading-spinner" />
                    <p>Loading customer profile…</p>
                  </div>
                ) : loadError ? (
                  <div className="cem-load-error">
                    <AlertCircle size={18} /> {loadError}
                  </div>
                ) : customer ? (
                  <>
                    <div className="cem-identity">
                      <div className="cem-avatar">
                        {customer.avatar_url ? (
                          <img src={customer.avatar_url} alt={displayName} />
                        ) : (
                          <span>{getInitials(customer.full_name)}</span>
                        )}
                      </div>
                      <div className="cem-identity-info">
                        <span className="cem-identity-name">{displayName}</span>
                        <span className={`cem-status-badge cem-status-${status}`}>{status}</span>
                      </div>
                    </div>

                    <section className="cem-section">
                      <h4 className="cem-section-title"><Mail size={15} /> Contact Information</h4>
                      <div className="cem-detail-row">
                        <span className="cem-detail-label"><Mail size={13} /> Email</span>
                        <span className="cem-detail-value">{customer.email || '—'}</span>
                      </div>
                      <div className="cem-detail-row">
                        <span className="cem-detail-label"><Phone size={13} /> Phone</span>
                        <span className="cem-detail-value">{customer.phone || '—'}</span>
                      </div>
                      <div className="cem-detail-row">
                        <span className="cem-detail-label"><Calendar size={13} /> Joined</span>
                        <span className="cem-detail-value">{formatDate(customer.created_at)}</span>
                      </div>
                    </section>

                    <section className="cem-section">
                      <h4 className="cem-section-title"><Globe size={15} /> Profile Preferences</h4>
                      <div className="cem-detail-row">
                        <span className="cem-detail-label"><Calendar size={13} /> Date of Birth</span>
                        <span className="cem-detail-value">{formatDate(customer.date_of_birth)}</span>
                      </div>
                      <div className="cem-detail-row">
                        <span className="cem-detail-label"><Globe size={13} /> Preferred Language</span>
                        <span className="cem-detail-value">
                          {customer.preferred_language === 'Others'
                            ? (customer.custom_language || 'Others')
                            : (customer.preferred_language || '—')}
                        </span>
                      </div>
                      <div className="cem-detail-row">
                        <span className="cem-detail-label"><Utensils size={13} /> Dietary Preference</span>
                        <span className="cem-detail-value">{DIETARY_LABELS[customer.dietary_preference] || '—'}</span>
                      </div>
                      <div className="cem-detail-row">
                        <span className="cem-detail-label"><AlertCircle size={13} /> Food Allergies</span>
                        <span className="cem-detail-value">{customer.food_allergies || '—'}</span>
                      </div>
                      <div className="cem-detail-row">
                        <span className="cem-detail-label"><Flame size={13} /> Spice Preference</span>
                        <span className="cem-detail-value">{SPICE_LABELS[customer.spice_preference] || '—'}</span>
                      </div>
                    </section>

                    <section className="cem-section">
                      <h4 className="cem-section-title"><Bell size={15} /> Communication Preferences</h4>
                      {COMMUNICATION_LABELS.map((t) => (
                        <div key={t.key} className="cem-detail-row">
                          <span className="cem-detail-label">{t.label}</span>
                          <span className={`cem-pref-badge ${customer[t.key] ? 'cem-pref-on' : 'cem-pref-off'}`}>
                            {customer[t.key] ? 'On' : 'Off'}
                          </span>
                        </div>
                      ))}
                    </section>

                    {confirmingDelete && (
                      <div className="cem-danger-zone">
                        <div className="cem-danger-header">
                          <ShieldAlert size={18} />
                          <p>
                            This will permanently delete <strong>{displayName}</strong>'s account.
                            This action cannot be undone.
                          </p>
                        </div>
                        {deleteError && (
                          <div className="cem-msg cem-msg-error">
                            <AlertCircle size={15} /> {deleteError}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : null}
              </div>

              {customer && !loading && !loadError && (
                <div className="cem-footer">
                  {confirmingDelete ? (
                    <>
                      <button className="cem-cancel-btn" onClick={() => setConfirmingDelete(false)} disabled={deleting}>
                        Cancel
                      </button>
                      <motion.button
                        className="cem-delete-confirm-btn"
                        onClick={handleDelete}
                        disabled={deleting}
                        whileHover={!deleting ? { scale: 1.02 } : {}}
                        whileTap={!deleting ? { scale: 0.98 } : {}}
                      >
                        {deleting ? 'Deleting…' : 'Yes, Delete Permanently'}
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <button className="cem-cancel-btn" onClick={handleClose}>
                        Close
                      </button>
                      <motion.button
                        className="cem-delete-btn"
                        onClick={() => setConfirmingDelete(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Trash2 size={15} /> Delete Customer
                      </motion.button>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
