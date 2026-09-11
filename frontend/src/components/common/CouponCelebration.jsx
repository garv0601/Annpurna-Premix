import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './CouponCelebration.css';

const CONFETTI_COLORS = ['#B22222', '#FFC300', '#2F8B57', '#8B1A1A', '#F4A300'];
const CONFETTI_COUNT = 24;

function useConfettiPieces(show) {
  // Re-randomized only when a new celebration starts, not on every render.
  return useMemo(() => (
    Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.2,
      duration: 1 + Math.random() * 0.6,
      rotate: (Math.random() - 0.5) * 540,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 6 + Math.random() * 6,
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [show]);
}

/**
 * Brief, non-blocking confetti + savings toast shown right after a coupon
 * is successfully applied. Rendered in a body-level portal so it never
 * affects the order summary layout. Purely presentational — receives the
 * already calculated discount amount, never computes it.
 */
export default function CouponCelebration({ show, amount, duration = 1800, onDone }) {
  const confettiPieces = useConfettiPieces(show);

  useEffect(() => {
    if (!show) return undefined;
    const timer = setTimeout(() => onDone?.(), duration);
    return () => clearTimeout(timer);
  }, [show, duration, onDone]);

  if (typeof document === 'undefined') return null;

  const formattedAmount = Math.round(Number(amount) || 0).toLocaleString('en-IN');

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          className="coupon-celebration-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="status"
          aria-live="polite"
        >
          <div className="coupon-celebration-confetti" aria-hidden="true">
            {confettiPieces.map((p) => (
              <motion.span
                key={p.id}
                className="confetti-piece"
                style={{
                  left: `${p.left}%`,
                  backgroundColor: p.color,
                  width: p.size,
                  height: p.size * 0.42,
                }}
                initial={{ y: -20, opacity: 0, rotate: 0 }}
                animate={{ y: 220, opacity: [0, 1, 1, 0], rotate: p.rotate }}
                transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
              />
            ))}
          </div>

          <motion.div
            className="coupon-celebration-card"
            initial={{ opacity: 0, scale: 0.7, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <p className="coupon-celebration-text">
              🎉 Woohoo! You saved <strong>₹{formattedAmount}</strong>!
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
