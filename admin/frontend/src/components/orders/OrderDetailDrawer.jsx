import React, { useEffect } from 'react';
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

const ORDER_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;
const displayValue = (value) => value || '—';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/**
 * Order detail modal.
 */
export default function OrderDetailDrawer({
  order,
  isOpen,
  onClose,
  onStatusChange,
  statusUpdating,
  statusMessage,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && order && (
        <div className="od-modal-layer">
          <motion.div
            className="od-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
          <motion.div
            className="od-drawer"
            id="order-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-detail-title"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Header */}
            <div className="od-header">
              <div>
                <h3 className="od-title" id="order-detail-title">{order.orderId}</h3>
                <p className="od-subtitle">Order Details</p>
              </div>
              <button className="od-close" onClick={onClose} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className="od-body">
              {/* Order Header */}
              <div className="od-section">
                <div className="od-status-row">
                  <OrderStatusBadge status={order.status} />
                  <span className="od-date">
                    {new Date(order.createdAt || order.date).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="od-info-grid od-header-grid">
                  <div className="od-info-item">
                    <span className="od-info-label">Payment Method</span>
                    <span className="od-info-value">{PAYMENT_LABEL[order.payment?.method] || displayValue(order.payment?.method)}</span>
                  </div>
                  <div className="od-info-item">
                    <span className="od-info-label">Payment Status</span>
                    <span className={`od-payment-status ${PAYMENT_STATUS_CLASS[order.payment?.status] || ''}`}>
                      {order.payment?.status
                        ? order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="od-section">
                <label className="od-status-label" htmlFor="order-status-select">Order Status</label>
                <div className="od-status-control">
                  <select
                    id="order-status-select"
                    className="od-status-select"
                    value={order.status}
                    onChange={(event) => onStatusChange(event.target.value)}
                    disabled={statusUpdating}
                  >
                    {ORDER_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  {statusUpdating && <span className="od-status-loading">Updating...</span>}
                </div>
                {statusMessage && (
                  <p className={`od-status-message od-status-message-${statusMessage.type}`} role="status">
                    {statusMessage.text}
                  </p>
                )}
              </div>

              {/* Customer */}
              <div className="od-section">
                <h4 className="od-section-title">
                  <MapPin size={15} /> Customer Details
                </h4>
                <div className="od-info-grid">
                  <div className="od-info-item">
                    <span className="od-info-label">Name</span>
                    <span className="od-info-value">{order.customer.fullName}</span>
                  </div>
                  <div className="od-info-item">
                    <span className="od-info-label">Email</span>
                    <span className="od-info-value od-break-word">{displayValue(order.customer.email)}</span>
                  </div>
                  <div className="od-info-item">
                    <span className="od-info-label">Phone</span>
                    <span className="od-info-value">{displayValue(order.customer.phone)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="od-section">
                  <h4 className="od-section-title">
                    <MapPin size={15} /> Shipping Address
                  </h4>
                  <div className="od-info-grid">
                    <div className="od-info-item">
                      <span className="od-info-label">Full Name</span>
                      <span className="od-info-value">{displayValue(order.shippingAddress.full_name)}</span>
                    </div>
                    <div className="od-info-item">
                      <span className="od-info-label">Phone</span>
                      <span className="od-info-value">{displayValue(order.shippingAddress.phone)}</span>
                    </div>
                    <div className="od-info-item od-info-wide">
                      <span className="od-info-label">Address Line 1</span>
                      <span className="od-info-value">{displayValue(order.shippingAddress.address_line1)}</span>
                    </div>
                    {order.shippingAddress.address_line2 && (
                      <div className="od-info-item od-info-wide">
                        <span className="od-info-label">Address Line 2</span>
                        <span className="od-info-value">{order.shippingAddress.address_line2}</span>
                      </div>
                    )}
                    <div className="od-info-item">
                      <span className="od-info-label">City</span>
                      <span className="od-info-value">{displayValue(order.shippingAddress.city)}</span>
                    </div>
                    <div className="od-info-item">
                      <span className="od-info-label">State</span>
                      <span className="od-info-value">{displayValue(order.shippingAddress.state)}</span>
                    </div>
                    <div className="od-info-item">
                      <span className="od-info-label">Postal Code</span>
                      <span className="od-info-value">{displayValue(order.shippingAddress.postal_code)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="od-section">
                <h4 className="od-section-title">
                  <Package size={15} /> Items ({order.items?.length || 0})
                </h4>
                <div className="od-items">
                  {order.items?.map((item) => (
                    <div key={item.id} className="od-item">
                      <div className="od-item-img">
                        {item.imageUrl
                          ? <img src={item.imageUrl} alt="" />
                          : <Package size={18} />}
                      </div>
                      <div className="od-item-info">
                        <p className="od-item-name">{item.productName}</p>
                        <p className="od-item-meta">
                          Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <div className="od-item-subtotal">
                        <span>Subtotal</span>
                        <strong>{formatCurrency(item.subtotal)}</strong>
                      </div>
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
                  {order.payment?.provider && (
                    <div className="od-info-item">
                      <span className="od-info-label">Provider</span>
                      <span className="od-info-value">{order.payment.provider}</span>
                    </div>
                  )}
                  {order.payment?.transactionId && (
                    <div className="od-info-item">
                      <span className="od-info-label">Transaction ID</span>
                      <span className="od-info-value">{order.payment.transactionId}</span>
                    </div>
                  )}
                  {order.payment?.paidAt && (
                    <div className="od-info-item">
                      <span className="od-info-label">Payment Date</span>
                      <span className="od-info-value">
                        {new Date(order.payment.paidAt).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
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

              {/* Price Summary */}
              <div className="od-totals">
                <h4 className="od-section-title od-totals-title">Price Summary</h4>
                <div className="od-total-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="od-total-row od-discount">
                  <span>Discount</span>
                  <span>−{formatCurrency(order.discount)}</span>
                </div>
                <div className="od-total-row">
                  <span>Shipping</span>
                  <span>{formatCurrency(order.shipping)}</span>
                </div>
                <div className="od-total-row">
                  <span>Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <div className="od-total-row od-grand-total">
                  <span>Total</span>
                  <span>{formatCurrency(order.amount)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
