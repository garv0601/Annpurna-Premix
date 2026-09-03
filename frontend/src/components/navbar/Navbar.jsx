import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/**
 * Navigation links config.
 * "Shop" uses React Router; others use hash anchors on the homepage.
 */
const navLinks = [
  { label: 'Shop', to: '/shop', isRoute: true },
  { label: 'Our Story', to: '/story', isRoute: true },
  { label: 'Reviews', hash: '#reviews', isRoute: false },
  { label: 'Contact', to: '/contact', isRoute: true },
];

const AnnpurnaWordmark = () => (
  <Link
    to="/"
    aria-label="ANNPURNA Premix Home"
    style={{
      textDecoration: 'none',
      display: 'block',
    }}
  >
    <div style={{
      fontFamily: "'Literata', Georgia, serif",
      fontSize: '24px',
      fontWeight: 600,
      color: '#B22222',
      letterSpacing: '0.04em',
      lineHeight: 1,
    }}>
      ANNPURNA
    </div>
    <div style={{
      fontFamily: "'Be Vietnam Pro', sans-serif",
      fontSize: '9px',
      fontWeight: 600,
      color: '#5D4037',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      lineHeight: 1,
      marginTop: '3px',
      marginBottom: '-12px',
      paddingLeft: '1px'
    }}>
      PREMIX
    </div>
  </Link>
);

export default function Navbar({ cartCount = 0, onOpenCart }) {
  const shouldReduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * Handle hash-based nav links.
   * If already on homepage, scroll to section.
   * If on another page, navigate to homepage then scroll.
   */
  const handleHashClick = (hash) => {
    setMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/' + hash);
    }
  };

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: scrolled ? 'rgba(255, 248, 244, 0.97)' : '#FFF8F4',
    borderBottom: `1px solid ${scrolled ? 'rgba(93, 64, 55, 0.14)' : 'rgba(93, 64, 55, 0.08)'}`,
    boxShadow: scrolled ? '0 2px 12px rgba(93, 64, 55, 0.07)' : 'none',
    padding: scrolled ? '12px 0' : '16px 0',
    transition: shouldReduce ? 'none' : 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  };

  const linkBaseStyle = {
    fontFamily: "'Be Vietnam Pro', system-ui, sans-serif",
    fontSize: '14px',
    fontWeight: 500,
    padding: '7px 14px',
    borderRadius: '6px',
    transition: 'color 0.18s, background 0.18s',
    textDecoration: 'none',
    cursor: 'pointer',
  };

  return (
    <>
      <nav style={navStyle} role="navigation" aria-label="Main navigation">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>

          {/* Wordmark */}
          <AnnpurnaWordmark />

          {/* Desktop Nav Links */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '4px',
            }}
            className="ann-nav-desktop"
          >
            {navLinks.map((link) => {
              const isActive = link.isRoute && location.pathname.startsWith(link.to);

              if (link.isRoute) {
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    style={{
                      ...linkBaseStyle,
                      color: isActive ? '#B22222' : '#5D4037',
                      background: isActive ? 'rgba(178,34,34,0.06)' : 'transparent',
                      borderBottom: isActive ? '2px solid #B22222' : '2px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = '#B22222';
                        e.currentTarget.style.background = 'rgba(178,34,34,0.06)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = '#5D4037';
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                );
              }

              return (
                <a
                  key={link.hash}
                  href={link.hash}
                  onClick={(e) => {
                    e.preventDefault();
                    handleHashClick(link.hash);
                  }}
                  style={{
                    ...linkBaseStyle,
                    color: '#5D4037',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#B22222';
                    e.currentTarget.style.background = 'rgba(178,34,34,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#5D4037';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Right: Cart + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Desktop Auth Controls */}
            <div className="ann-nav-desktop" style={{ alignItems: 'center', gap: '8px', marginRight: '4px' }}>
              {!isAuthenticated ? (
                <>
                  <Link 
                    to="/login" 
                    style={{ ...linkBaseStyle, color: '#5D4037', padding: '7px 10px' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#B22222'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#5D4037'; }}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    style={{ 
                      ...linkBaseStyle, 
                      color: '#FFF', 
                      background: '#B22222',
                      padding: '8px 16px',
                      fontWeight: 600,
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#8B1A1A'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#B22222'; }}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/account" 
                    aria-label="Account"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#5D4037',
                      padding: '8px',
                      borderRadius: '50%',
                      transition: 'color 0.2s, background 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#B22222';
                      e.currentTarget.style.background = 'rgba(178,34,34,0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#5D4037';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <User size={20} />
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Cart */}
            <button
              id="navbar-cart-btn"
              onClick={onOpenCart}
              aria-label={`Open cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
              style={{
                position: 'relative',
                background: 'transparent',
                border: '1.5px solid rgba(93, 64, 55, 0.2)',
                borderRadius: '8px',
                padding: '7px 10px',
                color: '#5D4037',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'border-color 0.18s, color 0.18s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#B22222';
                e.currentTarget.style.color = '#B22222';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(93, 64, 55, 0.2)';
                e.currentTarget.style.color = '#5D4037';
              }}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-7px',
                    right: '-7px',
                    background: '#B22222',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger (mobile only) */}
            <button
              id="navbar-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#5D4037',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
              }}
              className="ann-nav-mobile-only"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
            animate={shouldReduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: scrolled ? '54px' : '64px',
              left: 0,
              right: 0,
              zIndex: 999,
              background: '#FFF8F4',
              borderBottom: '1px solid rgba(93, 64, 55, 0.1)',
              boxShadow: '0 8px 24px rgba(93, 64, 55, 0.10)',
              padding: '20px var(--container-pad)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            {navLinks.map((link, i) => {
              const isActive = link.isRoute && location.pathname.startsWith(link.to);

              if (link.isRoute) {
                return (
                  <motion.div
                    key={link.to}
                    initial={shouldReduce ? {} : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.22 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMenuOpen(false)}
                      style={{
                        fontFamily: "'Be Vietnam Pro', sans-serif",
                        fontSize: '16px',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? '#B22222' : '#3D2B1F',
                        padding: '13px 16px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        borderBottom: '1px solid rgba(93, 64, 55, 0.07)',
                        display: 'block',
                        background: isActive ? 'rgba(178,34,34,0.06)' : 'transparent',
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              }

              return (
                <motion.a
                  key={link.hash}
                  href={link.hash}
                  onClick={(e) => {
                    e.preventDefault();
                    handleHashClick(link.hash);
                  }}
                  initial={shouldReduce ? {} : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.22 }}
                  style={{
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#3D2B1F',
                    padding: '13px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(93, 64, 55, 0.07)',
                    display: 'block',
                  }}
                >
                  {link.label}
                </motion.a>
              );
            })}

            {/* Mobile Auth Controls */}
            <div style={{ marginTop: '12px', paddingTop: '16px', borderTop: '1px solid rgba(93, 64, 55, 0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    style={{ ...linkBaseStyle, color: '#5D4037', display: 'block', textAlign: 'center', border: '1px solid rgba(93, 64, 55, 0.2)', padding: '12px' }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    style={{ ...linkBaseStyle, color: '#FFF', background: '#B22222', display: 'block', textAlign: 'center', padding: '12px', fontWeight: 600 }}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <Link
                  to="/account"
                  onClick={() => setMenuOpen(false)}
                  style={{ ...linkBaseStyle, color: '#5D4037', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: '1px solid rgba(93, 64, 55, 0.15)' }}
                >
                  <User size={18} />
                  My Account
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline responsive styles */}
      <style>{`
        .ann-nav-desktop { display: none !important; }
        .ann-nav-mobile-only { display: flex !important; }
        @media (min-width: 768px) {
          .ann-nav-desktop { display: flex !important; }
          .ann-nav-mobile-only { display: none !important; }
        }
      `}</style>
    </>
  );
}
