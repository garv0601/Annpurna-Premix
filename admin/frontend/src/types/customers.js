/**
 * Customer data types for ANNPURNA Admin.
 * Mirrors the Supabase schema: public.profiles, augmented with derived stats from orders.
 *
 * Relationships:
 *   profiles.id → orders.customer_id
 */

/**
 * @typedef {'active'|'inactive'} CustomerStatus
 */

/**
 * @typedef {Object} Customer
 * @property {string} id - UUID
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} email
 * @property {string} phone
 * @property {string} avatar_url - URL to avatar image
 * @property {number} total_orders - Derived from orders table
 * @property {number} total_spent - Derived from orders table
 * @property {string|null} last_order_date - Derived from most recent order
 * @property {CustomerStatus} status - Account status
 * @property {string} created_at - ISO timestamp
 */

/**
 * @typedef {Object} CustomerStats
 * @property {number} total_customers
 * @property {number} new_customers
 * @property {number} active_customers
 * @property {number} repeat_percentage
 */
