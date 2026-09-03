import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, MapPin, ArrowRight } from 'lucide-react';

export default function OrderSuccessPage() {
  const location = useLocation();
  const orderData = location.state;

  // If no order data, redirect to home
  if (!orderData) {
    return <Navigate to="/" replace />;
  }

  const {
    orderId,
    total,
    paymentMethod,
    deliveryMethod,
    address,
    razorpayPaymentId,
  } = orderData;

  const paymentLabel =
    paymentMethod === 'cod' ? 'Cash on Delivery' :
    paymentMethod === 'upi' ? 'UPI' : 'Credit/Debit Card';

  const deliveryLabel =
    deliveryMethod === 'express' ? 'Express (1–2 business days)' : 'Standard (3–5 business days)';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFF8F4',
      fontFamily: "'Be Vietnam Pro', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          background: '#FFF',
          borderRadius: '20px',
          padding: 'clamp(32px, 6vw, 56px)',
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 12px 48px rgba(93, 64, 55, 0.08)',
        }}
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2F8B57, #34A853)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <CheckCircle size={40} color="#FFF" strokeWidth={2.5} />
        </motion.div>

        <h1 style={{
          fontFamily: "'Literata', Georgia, serif",
          fontSize: 'clamp(24px, 4vw, 32px)',
          fontWeight: 700,
          color: '#1C1007',
          margin: '0 0 8px 0',
        }}>
          Order Placed!
        </h1>

        <p style={{
          fontSize: '15px',
          color: '#5D4037',
          margin: '0 0 32px 0',
          lineHeight: 1.5,
        }}>
          Thank you for ordering with Annpurna. Maa's love is on its way! 🙏
        </p>

        {/* Order Details */}
        <div style={{
          background: '#FFF8F4',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'left',
          marginBottom: '28px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: '#7A5C4A' }}>Order ID</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C1007' }}>{orderId}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: '#7A5C4A' }}>Total</span>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#B22222' }}>
              ₹{Number(total).toLocaleString('en-IN')}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: '#7A5C4A' }}>Payment</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C1007' }}>{paymentLabel}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: address ? '12px' : '0' }}>
            <span style={{ fontSize: '13px', color: '#7A5C4A' }}>Delivery</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C1007' }}>{deliveryLabel}</span>
          </div>

          {address && (
            <div style={{
              borderTop: '1px solid rgba(93, 64, 55, 0.1)',
              paddingTop: '12px',
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-start',
            }}>
              <MapPin size={14} style={{ color: '#7A5C4A', marginTop: '2px', flexShrink: 0 }} />
              <div style={{ fontSize: '13px', color: '#5D4037', lineHeight: 1.5 }}>
                {address.fullName}<br />
                {address.addressLine1}
                {address.addressLine2 ? `, ${address.addressLine2}` : ''}<br />
                {address.city}, {address.state} {address.postalCode}
              </div>
            </div>
          )}

          {razorpayPaymentId && (
            <div style={{
              borderTop: '1px solid rgba(93, 64, 55, 0.1)',
              paddingTop: '12px',
              marginTop: '12px',
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '12px', color: '#7A5C4A' }}>Payment ID</span>
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#5D4037', fontFamily: 'monospace' }}>
                {razorpayPaymentId}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link
            to="/orders"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: '#B22222',
              color: '#FFF',
              padding: '14px 24px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '15px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#8B1A1A'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#B22222'}
          >
            <Package size={18} /> View My Orders
          </Link>

          <Link
            to="/shop"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'transparent',
              color: '#5D4037',
              padding: '14px 24px',
              borderRadius: '10px',
              border: '1.5px solid rgba(93, 64, 55, 0.2)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '15px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#B22222';
              e.currentTarget.style.color = '#B22222';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(93, 64, 55, 0.2)';
              e.currentTarget.style.color = '#5D4037';
            }}
          >
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
