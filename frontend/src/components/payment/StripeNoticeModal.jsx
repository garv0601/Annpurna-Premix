import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X } from 'lucide-react';

export default function StripeNoticeModal({ isOpen, onClose, mode = 'add' }) {
  if (!isOpen) return null;

  const title = mode === 'add' ? 'Add New Payment Method' : 'Edit Payment Method';
  const text = mode === 'add'
    ? 'Secure payment setup will be handled by Stripe. Please wait while we integrate the Stripe Payment Element.'
    : 'Card details are securely managed by Stripe and cannot be directly edited here. To update, please add a new card.';

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(28, 16, 7, 0.4)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{
            background: '#FFF',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 12px 48px rgba(0,0,0,0.12)',
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '24px', position: 'relative' }}>
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: '#7A5C4A',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={20} />
            </button>
            
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#F0F7F4', // Safe green tint
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Lock size={24} color="#2F8B57" />
            </div>

            <h3 style={{
              fontFamily: "'Literata', Georgia, serif",
              fontSize: '20px',
              fontWeight: 600,
              color: '#1C1007',
              margin: '0 0 8px 0'
            }}>
              {title}
            </h3>
            
            <p style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: '14px',
              color: '#5D4037',
              lineHeight: 1.5,
              margin: '0 0 24px 0'
            }}>
              {text}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  borderRadius: '24px',
                  border: 'none',
                  background: '#1C1007',
                  color: '#FFF',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Understood
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
