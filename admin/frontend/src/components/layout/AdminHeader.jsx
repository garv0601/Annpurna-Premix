import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Menu } from 'lucide-react';
import './AdminHeader.css';

export default function AdminHeader({ onMenuToggle }) {
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

        <button className="header-notification-btn" aria-label="Notifications" id="admin-notifications-btn">
          <Bell size={20} />
          <span className="notification-badge" />
        </button>

        <div className="header-avatar" id="admin-avatar">
          <span>M</span>
        </div>
      </div>
    </motion.header>
  );
}
