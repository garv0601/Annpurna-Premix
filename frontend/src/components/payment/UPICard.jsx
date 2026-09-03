import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export default function UPICard({ upi, onDelete }) {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 auto', minWidth: 0 }}>
          {/* Simple UPI icon representation */}
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            border: '1px solid rgba(93, 64, 55, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontWeight: 700,
            fontSize: '14px',
            color: '#1C1007',
            flexShrink: 0,
          }}>
            UPI
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: '15px',
              color: '#1C1007',
              fontWeight: 600,
              marginBottom: '2px',
              wordBreak: 'break-word',
            }}>
              {upi.provider}
            </div>
            <div style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: '14px',
              color: '#5D4037',
              wordBreak: 'break-word',
            }}>
              {upi.upiId}
            </div>
          </div>
        </div>

        <div className="payment-card-actions">
          <button
            onClick={() => onDelete(upi)}
            aria-label="Remove payment method"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#7A5C4A',
              cursor: 'pointer',
              padding: '8px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#B22222'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#7A5C4A'}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
