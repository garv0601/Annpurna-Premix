import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, MapPin, CreditCard, Tag } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';
import './OrderDetailDrawer.css';

const PAYMENT_LABEL = {
  upi: 'UPI',
  card: 'Card',
  cod: 'COD',
  netbanking: 'Netbanking',
};

const PAYMENT_STATUS_CLASS = {
  paid: 'pstatus-paid',
  pending: 'pstatus-pending',
  failed: 'pstatus-failed',
  refunded: 'pstatus-refunded',
};

const drawerVariants = {
  hidden: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  visible: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/**
 * Order detail slide-in drawer.
 */
export default function OrderDetailDrawer({ order, isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && order && (
        <>
          <motion.div
            className="od-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
          <motion.aside
            className="od-drawer"
            id="order-detail-drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Header */}
            <div className="od-header">
              <div>
                <h3 className="od-title">{order.orderId}</h3>
                <p className="od-subtitle">Order Details</p>
              </div>
              <button className="od-close" onClick={onClose} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className="od-body">
              {/* Status + Date */}
              <div className="od-section od-status-row">
                <OrderStatusBadge status={order.status} />
                <span className="od-date">{order.date}</span>
              </div>

              {/* Customer */}
              <div className="od-section">
                <h4 className="od-section-title">
                  <MapPin size={15} /> Customer
                </h4>
                <div className="od-info-grid">
                  <div className="od-info-item">
                    <span className="od-info-label">Name</span>
                    <span className="od-info-value">{order.customer.fullName}</span>
                  </div>
                  {order.customer.phone && (
                    <div className="od-info-item">
                      <span className="od-info-label">Phone</span>
                      <span className="od-info-value">{order.customer.phone}</span>
                    </div>
                  )}
                  {order.customer.email && (
                    <div className="od-info-item">
                      <span className="od-info-label">Email</span>
                      <span className="od-info-value">{order.customer.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="od-section">
                <h4 className="od-section-title">
                  <Package size={15} /> Items ({order.items?.length || 0})
                </h4>
                <div className="od-items">
                  {order.items?.map((item) => (
                    <div key={item.id} className="od-item">
                      <div className="od-item-img">
                        <Package size={18} />
                      </div>
                      <div className="od-item-info">
                        <p className="od-item-name">{item.productName}</p>
                        <p className="od-item-meta">
                          ₹{item.unitPrice} × {item.quantity}
                        </p>
                      </div>
                      <span className="od-item-total">
                        ₹{item.subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="od-section">
                <h4 className="od-section-title">
                  <CreditCard size={15} /> Payment
                </h4>
                <div className="od-info-grid">
                  <div className="od-info-item">
                    <span className="od-info-label">Method</span>
                    <span className="od-info-value">
                      {PAYMENT_LABEL[order.payment?.method] || order.payment?.method}
                    </span>
                  </div>
                  <div className="od-info-item">
                    <span className="od-info-label">Status</span>
                    <span className={`od-payment-status ${PAYMENT_STATUS_CLASS[order.payment?.status] || ''}`}>
                      {order.payment?.status
                        ? order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coupon */}
              {order.coupon && (
                <div className="od-section">
                  <h4 className="od-section-title">
                    <Tag size={15} /> Coupon Applied
                  </h4>
                  <div className="od-coupon-pill">
                    <span className="od-coupon-code">{order.coupon.code}</span>
                    <span className="od-coupon-discount">
                      {order.coupon.discountType === 'percent'
                        ? `${order.coupon.discountValue}% off`
                        : `−₹${order.coupon.discountValue}`}
                    </span>
                  </div>
                </div>
              )}

              {/* Order Total */}
              <div className="od-totals">
                <div className="od-total-row">
                  <span>Subtotal</span>
                  <span>₹{(order.subtotal || order.amount).toLocaleString('en-IN')}</span>
                </div>
                {order.discount > 0 && (
                  <div className="od-total-row od-discount">
                    <span>Discount</span>
                    <span>−₹{order.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="od-total-row od-grand-total">
                  <span>Total</span>
                  <span>₹{order.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
