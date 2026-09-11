import { useState, useEffect, useCallback } from 'react';
import { validateCoupon as validateCouponRequest } from '../services/couponService';

/**
 * Applied coupon persists across the Cart -> Checkout navigation the same
 * way the cart itself does (localStorage), and is cleared once an order is
 * successfully placed.
 */
export const useCoupon = () => {
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const stored = localStorage.getItem('aether_coupon');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('aether_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('aether_coupon');
      }
    } catch (e) {
      console.error('Failed to persist coupon', e);
    }
  }, [appliedCoupon]);

  const applyCoupon = useCallback(async (code, subtotal) => {
    if (!code || !code.trim()) {
      setError('Please enter a coupon code.');
      return { success: false };
    }
    setApplying(true);
    setError(null);
    try {
      const result = await validateCouponRequest(code.trim().toUpperCase(), subtotal);
      setAppliedCoupon(result);
      return { success: true, result };
    } catch (err) {
      setAppliedCoupon(null);
      setError(err.message || 'Invalid coupon code');
      return { success: false, error: err.message };
    } finally {
      setApplying(false);
    }
  }, []);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setError(null);
  }, []);

  return { appliedCoupon, applying, error, applyCoupon, removeCoupon };
};
