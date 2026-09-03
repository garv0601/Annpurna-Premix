import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteAddressDialog({ isOpen, onClose, onConfirm, isDeleting }) {
  if (!isOpen) return null;

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
              background: '#FDECEA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <AlertTriangle size={24} color="#B22222" />
            </div>

            <h3 style={{
              fontFamily: "'Literata', Georgia, serif",
              fontSize: '20px',
              fontWeight: 600,
              color: '#1C1007',
              margin: '0 0 8px 0'
            }}>
              Delete this address?
            </h3>
            
            <p style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: '14px',
              color: '#5D4037',
              lineHeight: 1.5,
              margin: '0 0 24px 0'
            }}>
              This address will be removed from your saved addresses.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                disabled={isDeleting}
                style={{
                  padding: '10px 20px',
                  borderRadius: '24px',
                  border: '1.5px solid rgba(93, 64, 55, 0.2)',
                  background: 'transparent',
                  color: '#5D4037',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                style={{
                  padding: '10px 20px',
                  borderRadius: '24px',
                  border: 'none',
                  background: '#B22222',
                  color: '#FFF',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  opacity: isDeleting ? 0.7 : 1
                }}
              >
                {isDeleting ? 'Deleting...' : 'Delete Address'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
