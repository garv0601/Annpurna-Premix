/**
 * Centralized pricing rules shared by the Cart and Checkout pages so both
 * always compute identical shipping/discount/total values from the same
 * cart + coupon state (single source of truth — do not duplicate this math
 * elsewhere).
 */

// Standard Delivery: free once the order subtotal reaches this threshold.
export const STANDARD_DELIVERY_THRESHOLD = 200;
export const STANDARD_DELIVERY_CHARGE = 20;

// Express Delivery: flat charge regardless of subtotal (unchanged behavior).
export const EXPRESS_DELIVERY_CHARGE = 50;

/**
 * Standard Delivery: ₹20 below ₹200 subtotal, free (₹0) at/above ₹200.
 * Express Delivery: flat ₹50, unaffected by subtotal.
 */
export function calculateShippingCharge(subtotal = 0, deliveryMethod = 'standard') {
  if (deliveryMethod === 'express') return EXPRESS_DELIVERY_CHARGE;
  return subtotal >= STANDARD_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_CHARGE;
}

/** Total = Subtotal + Shipping - Discount (+ optional extra fees e.g. COD surcharge). */
export function calculateOrderTotal({ subtotal = 0, shipping = 0, discount = 0, extraFees = 0 }) {
  return Math.max(0, subtotal + shipping - discount + extraFees);
}
