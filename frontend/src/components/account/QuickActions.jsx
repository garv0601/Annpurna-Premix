import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CreditCard, ChevronRight } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    { label: 'Manage Addresses', icon: MapPin, path: '/account/addresses' },
    { label: 'Payment Methods', icon: CreditCard, path: '/account/payment-methods' }
  ];

  return (
    <div style={{
      background: '#FFF',
      border: '1px solid rgba(93, 64, 55, 0.1)',
      borderRadius: '12px',
      padding: '24px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <h3 style={{
        fontFamily: "'Literata', Georgia, serif",
        fontSize: '18px',
        fontWeight: 600,
        color: '#1C1007',
        marginBottom: '20px',
        marginTop: 0
      }}>
        Quick Actions
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'center' }}>
        {actions.map((action) => (
          <Link
            key={action.label}
            to={action.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 12px',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(93, 64, 55, 0.04)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(178, 34, 34, 0.08)',
                color: '#B22222',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <action.icon size={18} />
              </div>
              <span style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: '#3D2B1F'
              }}>
                {action.label}
              </span>
            </div>
            <ChevronRight size={18} color="#A8816A" />
          </Link>
        ))}
      </div>
    </div>
  );
}
