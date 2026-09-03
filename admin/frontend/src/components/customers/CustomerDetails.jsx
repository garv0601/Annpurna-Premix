import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Calendar, ShoppingBag, MapPin, Shield, UserX, UserCheck } from 'lucide-react';
import CustomerStatusBadge from './CustomerStatusBadge';
import './CustomerDetails.css';

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

function getInitials(first, last) {
  return `${(first || '').charAt(0)}${(last || '').charAt(0)}`.toUpperCase() || '?';
}

/**
 * Customer Details Drawer showing profile info, addresses, and recent orders.
 */
export default function CustomerDetails({
  customer,
  orders,
  addresses,
  loading,
  isOpen,
  onClose,
  onDeactivate,
  onActivate,
}) {
  const handleStatusToggle = async () => {
    if (!customer) return;
    if (customer.status === 'active') {
      if (window.confirm(`Are you sure you want to deactivate ${customer.full_name || customer.first_name}?`)) {
        const result = await onDeactivate?.(customer.id);
        if (result?.success) {
          onClose();
        }
      }
    } else {
      const result = await onActivate?.(customer.id);
      if (result?.success) {
        onClose();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && customer && (
        <>
          <motion.div
            className="cd-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
          <motion.aside
            className="cd-drawer"
            id="customer-detail-drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Header */}
            <div className="cd-header">
              <h3 className="cd-title">Customer Profile</h3>
              <button className="cd-close" onClick={onClose} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className="cd-body">
              {/* Profile Card */}
              <div className="cd-profile-card">
                <div className="cd-avatar-large">
                  {customer.avatar_url ? (
                    <img src={customer.avatar_url} alt={customer.full_name || customer.first_name} />
                  ) : (
                    <span>{getInitials(customer.first_name, customer.last_name)}</span>
                  )}
                </div>
                <div className="cd-profile-info">
                  <h4 className="cd-name">
                    {customer.full_name || `${customer.first_name} ${customer.last_name}`.trim()}
                  </h4>
                  <CustomerStatusBadge status={customer.status} />
                </div>
              </div>

              {/* Contact Info */}
              <div className="cd-section">
                <div className="cd-contact-row">
                  <Mail size={15} /> <span>{customer.email || '—'}</span>
                </div>
                <div className="cd-contact-row">
                  <Phone size={15} /> <span>{customer.phone || '—'}</span>
                </div>
                <div className="cd-contact-row">
                  <Calendar size={15} /> <span>Joined {formatDate(customer.created_at)}</span>
                </div>
              </div>

              {/* Statistics */}
              <div className="cd-stats-grid">
                <div className="cd-stat-box">
                  <span className="cd-stat-label">Total Orders</span>
                  <span className="cd-stat-val">{customer.total_orders}</span>
                </div>
                <div className="cd-stat-box">
                  <span className="cd-stat-label">Total Spent</span>
                  <span className="cd-stat-val">₹{(Number(customer.total_spent) || 0).toLocaleString()}</span>
                </div>
                <div className="cd-stat-box">
                  <span className="cd-stat-label">Last Order</span>
                  <span className="cd-stat-val">{formatDate(customer.last_order_date)}</span>
                </div>
              </div>

              {/* Addresses */}
              {addresses && addresses.length > 0 && (
                <div className="cd-section cd-addresses-section">
                  <h4 className="cd-section-title">
                    <MapPin size={15} /> Addresses
                  </h4>
                  <div className="cd-addresses-list">
                    {addresses.map((addr) => (
                      <div key={addr.id} className={`cd-address-card ${addr.is_default ? 'cd-address-default' : ''}`}>
                        <div className="cd-address-top">
                          <span className="cd-address-label">
                            {addr.label || 'Address'}
                            {addr.is_default && <span className="cd-default-badge">Default</span>}
                          </span>
                        </div>
                        <div className="cd-address-body">
                          {addr.full_name && <span className="cd-address-name">{addr.full_name}</span>}
                          <span>{addr.address_line_1}</span>
                          {addr.address_line_2 && <span>{addr.address_line_2}</span>}
                          <span>{[addr.city, addr.state, addr.postal_code].filter(Boolean).join(', ')}</span>
                          {addr.phone && (
                            <span className="cd-address-phone">
                              <Phone size={12} /> {addr.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Orders List */}
              <div className="cd-section cd-orders-section">
                <h4 className="cd-section-title">
                  <ShoppingBag size={15} /> Recent Orders
                </h4>
                
                {loading ? (
                  <div className="cd-loading">Loading orders...</div>
                ) : orders && orders.length > 0 ? (
                  <div className="cd-orders-list">
                    {orders.map((order) => (
                      <div key={order.id} className="cd-order-item">
                        <div className="cd-order-top">
                          <span className="cd-order-id">#{typeof order.id === 'string' ? order.id.slice(0, 8) : order.id}</span>
                          <span className="cd-order-amount">₹{(Number(order.total_amount) || 0).toLocaleString()}</span>
                        </div>
                        <div className="cd-order-bottom">
                          <span className="cd-order-date">{formatDate(order.created_at)}</span>
                          <span className={`cd-order-status cd-os-${order.status}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="cd-no-orders">No order history available.</div>
                )}
              </div>

              {/* Deactivate / Activate Action */}
              <div className="cd-footer-actions">
                {customer.status === 'active' ? (
                  <motion.button
                    className="cd-deactivate-btn"
                    onClick={handleStatusToggle}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <UserX size={15} /> Deactivate Account
                  </motion.button>
                ) : (
                  <motion.button
                    className="cd-activate-btn"
                    onClick={handleStatusToggle}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <UserCheck size={15} /> Activate Account
                  </motion.button>
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
