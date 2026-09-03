import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Edit2, Trash2 } from 'lucide-react';

export default function PaymentCard({ payment, onEdit, onDelete, onSetDefault }) {
  const isDefault = payment.isDefault;
  
  // Format card number to mask
  const maskedNumber = `**** **** **** ${payment.last4}`;
  
  // Format expiry
  const expiry = `Expires ${payment.expMonth.toString().padStart(2, '0')}/${payment.expYear.toString().slice(-2)}`;

  // Basic brand styling logic based on 'visa', 'mastercard', etc.
  // In a real app we might use icons from react-icons or similar.
  // For now, we'll format text.
  const brandDisplay = payment.brand.charAt(0).toUpperCase() + payment.brand.slice(1);
  const bankName = payment.brand === 'mastercard' ? 'SBI' : 'HDFC Bank';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="payment-card-responsive"
      style={{
        background: '#FFF',
        border: '1px solid rgba(93, 64, 55, 0.1)',
        borderRadius: '12px',
        padding: 'clamp(16px, 4vw, 24px)',
        position: 'relative',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        boxSizing: 'border-box',
      }}
    >
      <div className="payment-card-layout">
        {/* Left Content */}
        <div style={{ minWidth: 0, flex: '1 1 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <div style={{
              fontFamily: "'Literata', Georgia, serif",
              fontSize: '18px',
              fontWeight: 700,
              color: payment.brand === 'visa' ? '#1A56B0' : '#E03C31',
              fontStyle: 'italic',
              letterSpacing: '0.05em'
            }}>
              {brandDisplay}
            </div>
            {isDefault && (
              <span style={{
                background: '#FFC300',
                color: '#1C1007',
                padding: '2px 8px',
                borderRadius: '12px',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '10px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap'
              }}>
                <CheckCircle2 size={12} />
                Default
              </span>
            )}
          </div>

          <div style={{
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontSize: '15px',
            color: '#1C1007',
            fontWeight: 500,
            lineHeight: 1.6,
            marginBottom: '4px',
            wordBreak: 'break-word',
          }}>
            {bankName} {brandDisplay}
          </div>
          
          <div style={{
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontSize: '15px',
            color: '#5D4037',
            lineHeight: 1.6,
            marginBottom: '4px',
            letterSpacing: '0.05em',
            wordBreak: 'break-word',
          }}>
            {maskedNumber}
          </div>

          <div style={{
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontSize: '13px',
            color: '#7A5C4A',
          }}>
            {expiry}
          </div>
        </div>

        {/* Right Actions */}
        <div className="payment-card-actions">
          {!isDefault && (
            <button
              onClick={() => onSetDefault(payment.id)}
              aria-label="Set payment method as default"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#1C1007',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '4px 8px',
                transition: 'opacity 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Set as Default
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => onEdit(payment)}
              aria-label="Manage payment method"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#B22222',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'opacity 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <Edit2 size={14} />
              Edit
            </button>

            <button
              onClick={() => onDelete(payment)}
              aria-label="Remove payment method"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#7A5C4A',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#B22222'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#7A5C4A'}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
