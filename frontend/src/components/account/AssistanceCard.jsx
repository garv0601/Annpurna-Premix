import React from 'react';
import { HeadphonesIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AssistanceCard() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #B22222 0%, #8B1A1A 100%)',
      borderRadius: '12px',
      padding: '24px',
      height: '100%',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <h3 style={{
        fontFamily: "'Literata', Georgia, serif",
        fontSize: '20px',
        fontWeight: 600,
        marginBottom: '8px',
        marginTop: 0
      }}>
        Need Assistance?
      </h3>
      <p style={{
        fontFamily: "'Be Vietnam Pro', sans-serif",
        fontSize: '14px',
        lineHeight: 1.5,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: '24px',
        flex: 1
      }}>
        Our support team is ready to help you with your homemade journey.
      </p>

      <Link
        to="/contact"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          background: '#FFFFFF',
          color: '#B22222',
          padding: '12px 16px',
          borderRadius: '24px',
          textDecoration: 'none',
          fontFamily: "'Be Vietnam Pro', sans-serif",
          fontSize: '14px',
          fontWeight: 600,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <HeadphonesIcon size={16} />
        Visit Help Center
      </Link>
    </div>
  );
}
