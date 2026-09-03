import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, User, MapPin, CreditCard, LogOut, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function AccountSidebar({ user, onSignOut, isMobile }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isOpen, setIsOpen] = useState(false);

  // Close menu if window resizes to desktop width
  useEffect(() => {
    if (!isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const navItems = [
    { label: 'My Orders', icon: Package, path: '/orders' },
    { label: 'Profile Settings', icon: User, path: '/account' },
    { label: 'Saved Addresses', icon: MapPin, path: '/account/addresses' },
    { label: 'Payment Methods', icon: CreditCard, path: '/account/payment-methods' },
  ];

  const getFirstName = () => {
    if (user?.user_metadata?.fullName) {
      return user.user_metadata.fullName.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'beta';
  };

  const handleNavClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const renderSidebarContent = (isDrawer = false) => (
    <div style={{
      background: '#FDF7F4',
      height: '100%',
      minHeight: isDrawer ? '100%' : '100vh',
      padding: '40px 24px',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      borderRight: isDrawer ? 'none' : '1px solid rgba(93, 64, 55, 0.08)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h2 style={{
            fontFamily: "'Literata', Georgia, serif",
            fontSize: 'clamp(22px, 2vw, 28px)',
            fontWeight: 600,
            color: '#B22222',
            lineHeight: 1.2,
            marginBottom: '8px',
            wordBreak: 'break-word',
            marginTop: 0,
          }}>
            Maa's<br />Kitchen<br />Account
          </h2>
          <p style={{
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontSize: '15px',
            color: '#5D4037',
            margin: 0,
            wordBreak: 'break-word',
          }}>
            Welcome back, {getFirstName()}!
          </p>
        </div>
        
        {isDrawer && (
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#5D4037',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        )}
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {navItems.map((item) => {
          const isActive = currentPath === item.path;

          return (
            <Link
              key={item.label}
              to={item.path}
              onClick={handleNavClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '24px',
                textDecoration: 'none',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#3D2B1F' : '#5D4037',
                background: isActive ? '#FFC300' : 'transparent',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'rgba(93, 64, 55, 0.04)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ height: '1px', background: 'rgba(93, 64, 55, 0.1)', margin: '16px 0' }} />

      <div>
        <button
          onClick={() => {
            handleNavClick();
            onSignOut();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            width: '100%',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontSize: '14px',
            fontWeight: 500,
            color: '#5D4037',
            textAlign: 'left',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#B22222'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#5D4037'}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Log Out</span>
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFF',
            border: '1px solid rgba(93, 64, 55, 0.15)',
            padding: '10px 16px',
            borderRadius: '24px',
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontSize: '14px',
            fontWeight: 600,
            color: '#1C1007',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#F9F9F9'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#FFF'}
        >
          <Menu size={16} />
          Account Menu
        </button>

        {/* Overlay and Slide-out Drawer */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsOpen(false)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.15)',
                  zIndex: 9998,
                }}
              />

              {/* Drawer */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: 'min(85vw, 320px)',
                  background: '#FDF7F4',
                  zIndex: 9999,
                  boxShadow: '4px 0 24px rgba(0,0,0,0.08)',
                  overflowY: 'auto'
                }}
              >
                {renderSidebarContent(true)}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop Permanent Sidebar
  return renderSidebarContent(false);
}
