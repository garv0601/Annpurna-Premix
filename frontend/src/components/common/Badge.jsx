import React from 'react';

export const Badge = ({ children, variant = 'cyan' }) => {
  const styles = {
    cyan: { background: 'rgba(0, 242, 254, 0.12)', color: '#00f2fe', border: '1px solid rgba(0, 242, 254, 0.3)' },
    purple: { background: 'rgba(112, 0, 255, 0.15)', color: '#b273ff', border: '1px solid rgba(112, 0, 255, 0.3)' },
    green: { background: 'rgba(0, 255, 170, 0.12)', color: '#00ffaa', border: '1px solid rgba(0, 255, 170, 0.3)' },
    amber: { background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }
  };

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        borderRadius: 'var(--radius-full)',
        ...styles[variant]
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
