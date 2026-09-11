import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Menu } from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import { useNotifications } from '../../hooks/useNotifications';
import './AdminHeader.css';

export default function AdminHeader({ onMenuToggle }) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifWrapRef = useRef(null);
  const { notifications, unreadCount, loading, error, markAsRead } = useNotifications();

  // Close the panel on outside click.
  useEffect(() => {
    if (!isNotifOpen) return undefined;
    function handleClickOutside(e) {
      if (notifWrapRef.current && !notifWrapRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotifOpen]);

  return (
    <motion.header
      className="admin-header"
      id="admin-header"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="header-left">
        <button
          className="header-menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>
        <div className="header-greeting">
          <h2>Welcome back, <span className="greeting-name">Maa</span></h2>
          <p>Here is what's cooking in your business today.</p>
        </div>
      </div>

      <div className="header-right">
        <div className="header-search">
          <Search size={18} className="header-search-icon" />
          <input
            type="text"
            placeholder="Search orders, products..."
            className="header-search-input"
            id="admin-search-input"
          />
        </div>

        <div className="header-notification-wrap" ref={notifWrapRef}>
          <button
            className="header-notification-btn"
            aria-label="Notifications"
            aria-expanded={isNotifOpen}
            id="admin-notifications-btn"
            onClick={() => setIsNotifOpen((prev) => !prev)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          {isNotifOpen && (
            <NotificationPanel
              notifications={notifications}
              loading={loading}
              error={error}
              unreadCount={unreadCount}
              onRead={markAsRead}
            />
          )}
        </div>

        <div className="header-avatar" id="admin-avatar">
          <span>M</span>
        </div>
      </div>
    </motion.header>
  );
}
