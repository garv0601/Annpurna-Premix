import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getUnreadNotifications,
  markNotificationRead,
  subscribeToNotifications,
} from '../services/notificationService';

/**
 * Admin notification bell — unread notifications only (read ones
 * intentionally disappear from this list per product requirement).
 * Handles initial load, real-time inserts/reads, and optimistic
 * mark-as-read with rollback on failure.
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const knownIds = useRef(new Set());

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUnreadNotifications();
      setNotifications(data);
      knownIds.current = new Set(data.map((n) => n.id));
      setError(null);
    } catch (err) {
      setError(err.message || 'Unable to load notifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Real-time: new notification rows appear at the top instantly; rows
  // marked read elsewhere (another tab/session) disappear here too.
  useEffect(() => {
    const unsubscribe = subscribeToNotifications({
      onInsert: (row) => {
        if (row.is_read || knownIds.current.has(row.id)) return;
        knownIds.current.add(row.id);
        setNotifications((prev) => [row, ...prev]);
      },
      onUpdate: (row) => {
        if (!row.is_read) return;
        knownIds.current.delete(row.id);
        setNotifications((prev) => prev.filter((n) => n.id !== row.id));
      },
    });
    return unsubscribe;
  }, []);

  const markAsRead = useCallback(async (id) => {
    const previous = notifications;
    knownIds.current.delete(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    try {
      await markNotificationRead(id);
    } catch (err) {
      console.error('markAsRead error:', err);
      // Roll back so the badge/list stay accurate if the write failed.
      knownIds.current.add(id);
      setNotifications(previous);
    }
  }, [notifications]);

  return {
    notifications,
    unreadCount: notifications.length,
    loading,
    error,
    markAsRead,
    refresh: fetchNotifications,
  };
}
