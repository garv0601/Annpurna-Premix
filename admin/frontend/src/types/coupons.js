/**
 * Coupon data types for ANNPURNA Admin.
 * Prepared for Supabase migration.
 */

/**
 * @typedef {'active' | 'expired' | 'scheduled'} CouponStatus
 * @typedef {'percentage' | 'fixed'} DiscountType
 */

/**
 * @typedef {Object} Coupon
 * @property {string} id - UUID
 * @property {string} code - The coupon code string (e.g. WELCOME20)
 * @property {DiscountType} discount_type
 * @property {number} discount_value
 * @property {number|null} min_order_amount
 * @property {number|null} max_discount
 * @property {number|null} usage_limit
 * @property {number} usage_count
 * @property {string|null} start_date - ISO date
 * @property {string|null} expiry_date - ISO date
 * @property {CouponStatus} status
 * @property {string} created_at
 */

/**
 * @typedef {Object} CouponStats
 * @property {number} total_coupons
 * @property {number} active_coupons
 * @property {number} expiring_soon
 * @property {number} total_usage
 */
