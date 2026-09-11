/**
 * NOTIFICATION SERVICE — Admin Dashboard notification bell
 *
 * Talks directly to the `public.admin_notifications` table via the anon
 * key. Access is gated entirely by the `is_admin()` RLS policy (same
 * pattern already used for `coupons` — see services/couponService.js), so
 * only an authenticated user with an active `admin_users` row can read or
 * update rows here. Customers can never reach this table.
 *
 * Rows are created exclusively by database triggers on `orders` and
 * `Profiles` (see the SQL provided for this feature) — the frontend never
 * inserts notifications itself, which is what prevents duplicates across
 * admin page refreshes/re-opens.
 */

import { supabase } from '../lib/supabase';

const TABLE = 'admin_notifications';

/** Fetch unread notifications, newest first. */
export async function getUnreadNotifications(limit = 30) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[notificationService] getUnreadNotifications error:', error);
    throw new Error('Unable to load notifications.');
  }
  return data || [];
}

/** Mark a single notification as read. */
export async function markNotificationRead(id) {
  const { error } = await supabase
    .from(TABLE)
    .update({ is_read: true })
    .eq('id', id);

  if (error) {
    console.error('[notificationService] markNotificationRead error:', error);
    throw new Error('Unable to mark notification as read.');
  }
  return true;
}

/**
 * Subscribe to real-time changes on admin_notifications so new events
 * (and reads made from another admin tab/session) update this session
 * without a manual refresh. Returns an unsubscribe function.
 */
export function subscribeToNotifications({ onInsert, onUpdate } = {}) {
  const channel = supabase
    .channel('admin-notifications-changes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: TABLE },
      (payload) => onInsert?.(payload.new)
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: TABLE },
      (payload) => onUpdate?.(payload.new)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
