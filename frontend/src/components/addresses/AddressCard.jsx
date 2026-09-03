import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Edit2, Trash2 } from 'lucide-react';

export default function AddressCard({ address, onEdit, onDelete, onSetDefault }) {
  const isDefault = address.isDefault;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="address-card-responsive"
      style={{
        background: isDefault ? '#FFFDF5' : '#FFFFFF',
        border: '1px solid',
        borderColor: isDefault ? '#F0D060' : 'rgba(93, 64, 55, 0.1)',
        borderRadius: '12px',
        padding: 'clamp(16px, 4vw, 24px)',
        position: 'relative',
        boxShadow: isDefault ? '0 4px 16px rgba(240, 208, 96, 0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
        boxSizing: 'border-box',
      }}
    >
      {isDefault && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          background: '#FFC300',
          color: '#1C1007',
          padding: '4px 12px',
          borderBottomLeftRadius: '8px',
          borderTopRightRadius: '11px',
          fontFamily: "'Be Vietnam Pro', sans-serif",
          fontSize: '11px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <CheckCircle2 size={12} />
          Default
        </div>
      )}

      <div className="address-card-layout">
        {/* Left Content */}
        <div style={{ minWidth: 0, flex: '1 1 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <h3 style={{
              fontFamily: "'Literata', Georgia, serif",
              fontSize: '18px',
              fontWeight: 600,
              color: '#1C1007',
              margin: 0,
              wordBreak: 'break-word',
            }}>
              {address.fullName}
            </h3>
            <span style={{
              background: '#FDECEA',
              color: '#B22222',
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              whiteSpace: 'nowrap',
            }}>
              {address.type}
            </span>
          </div>

          <div style={{
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontSize: '14px',
            color: '#5D4037',
            lineHeight: 1.6,
            marginBottom: '16px',
            wordBreak: 'break-word',
          }}>
            <div>{address.addressLine1},</div>
            {address.addressLine2 && <div>{address.addressLine2},</div>}
            <div>{address.city}, {address.state} {address.pinCode}</div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontSize: '14px',
            color: '#3D2B1F',
            fontWeight: 500
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
            {address.mobileNumber}
          </div>
        </div>

        {/* Right Actions */}
        <div className="address-card-actions" style={{
          marginTop: isDefault ? '20px' : '0' // Push down slightly if default badge is present
        }}>
          {!isDefault && (
            <button
              onClick={() => onSetDefault(address.id)}
              aria-label="Set this address as default"
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

          <button
            onClick={() => onEdit(address)}
            aria-label="Edit address"
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
            onClick={() => onDelete(address)}
            aria-label="Delete address"
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
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}
