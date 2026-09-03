import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button'
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: 'var(--radius-sm)',
    fontWeight: '600',
    transition: 'var(--transition-fast)',
    border: 'none',
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%)',
      color: '#090b10',
      boxShadow: '0 4px 15px rgba(0, 242, 254, 0.25)'
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.08)',
      color: 'var(--text-main)',
      border: '1px solid var(--border-color)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--accent-cyan)',
      border: '1px solid var(--accent-cyan)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-muted)'
    }
  };

  const sizes = {
    sm: { padding: '6px 12px', fontSize: '13px' },
    md: { padding: '10px 18px', fontSize: '14px' },
    lg: { padding: '14px 24px', fontSize: '16px' }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyles, ...variants[variant], ...sizes[size] }}
      className={`glow-button ${className}`}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />}
      {children}
    </button>
  );
};

export default Button;
