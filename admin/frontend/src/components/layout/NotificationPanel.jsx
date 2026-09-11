import React from 'react';
import { ShoppingBag, UserPlus, Bell, AlertCircle } from 'lucide-react';
import { timeAgo } from '../../utils/timeAgo';
import './NotificationPanel.css';

const TYPE_META = {
  new_order: { icon: ShoppingBag, className: 'notif-type-order' },
  new_customer: { icon: UserPlus, className: 'notif-type-customer' },
};

export default function NotificationPanel({ notifications, loading, error, unreadCount, onRead }) {
  return (
    <div className="notification-panel" role="menu" aria-label="Notifications">
      <div className="notification-panel-header">
        <h3>Notifications</h3>
        <span className="notification-panel-subcount">
          {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        </span>
      </div>

      <div className="notification-panel-body">
        {loading && (
          <div className="notification-panel-status">Loading notifications…</div>
        )}

        {!loading && error && (
          <div className="notification-panel-status notification-panel-error">
            <AlertCircle size={16} />
            <span>Couldn't load notifications. Please try again later.</span>
          </div>
        )}

        {!loading && !error && notifications.length === 0 && (
          <div className="notification-panel-empty">
            <Bell size={26} />
            <p className="notification-panel-empty-title">You're all caught up!</p>
            <p className="notification-panel-empty-sub">No new notifications.</p>
          </div>
        )}

        {!loading && !error && notifications.map((n) => {
          const meta = TYPE_META[n.type] || TYPE_META.new_order;
          const Icon = meta.icon;
          return (
            <button
              key={n.id}
              className="notification-item notification-unread"
              onClick={() => onRead(n.id)}
              type="button"
            >
              <span className={`notification-item-icon ${meta.className}`}>
                <Icon size={17} />
              </span>
              <span className="notification-item-body">
                <span className="notification-item-title-row">
                  <span className="notification-item-title">{n.title}</span>
                  <span className="notification-unread-dot" aria-hidden="true" />
                </span>
                <span className="notification-item-message">{n.message}</span>
                <span className="notification-item-time">{timeAgo(n.created_at)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
