import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle2, XCircle, Clock, RotateCcw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getUserOrders } from '../../services/orderService';

// Maps real order_status values (see OrderStatusBadge) to this card's look.
const STATUS_CONFIG = {
  delivered:    { label: 'DELIVERED',   color: '#2F8B57', bg: 'rgba(47, 139, 87, 0.1)',   icon: CheckCircle2, dateLabel: 'Delivered on' },
  shipped:      { label: 'SHIPPED',     color: '#D97706', bg: 'rgba(217, 119, 6, 0.1)',   icon: Truck,        dateLabel: 'Shipped on' },
  'in-transit': { label: 'IN TRANSIT',  color: '#D97706', bg: 'rgba(217, 119, 6, 0.1)',   icon: Truck,        dateLabel: 'Placed on' },
  processing:   { label: 'PROCESSING',  color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)',  icon: Package,      dateLabel: 'Placed on' },
  confirmed:    { label: 'CONFIRMED',   color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)',  icon: Package,      dateLabel: 'Placed on' },
  pending:      { label: 'PENDING',     color: '#D97706', bg: 'rgba(217, 119, 6, 0.1)',   icon: Clock,        dateLabel: 'Placed on' },
  cancelled:    { label: 'CANCELLED',   color: '#B22222', bg: 'rgba(178, 34, 34, 0.1)',   icon: XCircle,      dateLabel: 'Cancelled on' },
  refunded:     { label: 'REFUNDED',    color: '#6B7280', bg: 'rgba(107, 114, 128, 0.1)', icon: RotateCcw,    dateLabel: 'Refunded on' },
};

function getStatusConfig(status) {
  return STATUS_CONFIG[status] || { label: (status || 'PENDING').toUpperCase(), color: '#6B7280', bg: 'rgba(107, 114, 128, 0.1)', icon: Package, dateLabel: 'Placed on' };
}

function getOrderTitle(order) {
  const items = order.items || [];
  if (items.length === 0) return `Order #${(order.id || '').slice(0, 8)}`;
  const first = items[0].name || 'Item';
  return items.length > 1 ? `${first} (+${items.length - 1} more)` : first;
}

function getDateText(order) {
  if (!order.createdAt) return '';
  const { dateLabel } = getStatusConfig(order.status);
  const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${dateLabel} ${date}`;
}

export default function RecentOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchRecentOrders() {
      if (!user?.id) {
        if (isMounted) setIsLoading(false);
        return;
      }
      try {
        // getUserOrders() returns the customer's orders sorted newest-first
        const data = await getUserOrders();
        if (isMounted) setOrders(data.slice(0, 2));
      } catch (error) {
        console.error('Failed to fetch recent orders', error);
        if (isMounted) setOrders([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchRecentOrders();
    return () => { isMounted = false; };
  }, [user]);

  return (
    <div style={{
      background: '#FFF',
      border: '1px solid rgba(93, 64, 55, 0.1)',
      borderRadius: '12px',
      padding: '24px',
      height: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h3 style={{
          fontFamily: "'Literata', Georgia, serif",
          fontSize: '18px',
          fontWeight: 600,
          color: '#1C1007',
          margin: 0
        }}>
          Recent Orders
        </h3>
        <Link
          to="/orders"
          style={{
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontSize: '13px',
            fontWeight: 600,
            color: '#B22222',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          View All &rarr;
        </Link>
      </div>

      {/* Order List */}
      {isLoading ? (
        <p style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '13px', color: '#7A5C4A', margin: 0 }}>
          Loading your orders...
        </p>
      ) : orders.length === 0 ? (
        <p style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '13px', color: '#7A5C4A', margin: 0 }}>
          You haven't placed any orders yet.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(order => {
            const status = getStatusConfig(order.status);
            const Icon = status.icon;
            return (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                style={{
                  background: '#FFF8F4',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap',
                  textDecoration: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: 'rgba(178, 34, 34, 0.08)',
                    color: '#B22222',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div style={{
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#3D2B1F',
                      marginBottom: '2px'
                    }}>
                      {getOrderTitle(order)}
                    </div>
                    <div style={{
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                      fontSize: '12px',
                      color: '#7A5C4A'
                    }}>
                      {getDateText(order)}
                    </div>
                  </div>
                </div>

                <div style={{
                  background: status.bg,
                  color: status.color,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>
                  {status.label}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
