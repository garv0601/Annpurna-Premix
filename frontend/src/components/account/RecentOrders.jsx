import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck } from 'lucide-react';

// Isolated mock data for development
const MOCK_ORDERS = [
  {
    id: 'ord_1',
    title: 'Dal Makhani Premix',
    statusLabel: 'DELIVERED',
    statusColor: '#2F8B57',
    statusBg: 'rgba(47, 139, 87, 0.1)',
    dateText: 'Delivered on 12 Oct',
    icon: Package
  },
  {
    id: 'ord_2',
    title: 'Methi Thepla Mix (x2)',
    statusLabel: 'IN TRANSIT',
    statusColor: '#D97706',
    statusBg: 'rgba(217, 119, 6, 0.1)',
    dateText: 'Arriving Tomorrow',
    icon: Truck
  }
];

export default function RecentOrders() {
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {MOCK_ORDERS.map(order => (
          <div key={order.id} style={{
            background: '#FFF8F4',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'rgba(178, 34, 34, 0.08)',
                color: '#B22222',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <order.icon size={20} />
              </div>
              <div>
                <div style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#3D2B1F',
                  marginBottom: '2px'
                }}>
                  {order.title}
                </div>
                <div style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: '12px',
                  color: '#7A5C4A'
                }}>
                  {order.dateText}
                </div>
              </div>
            </div>

            <div style={{
              background: order.statusBg,
              color: order.statusColor,
              padding: '4px 8px',
              borderRadius: '4px',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              {order.statusLabel}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
