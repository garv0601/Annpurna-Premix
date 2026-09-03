import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Eye, MapPin } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';

export default function OrderCard({ order, onReorder }) {
  const navigate = useNavigate();
  const [isReordering, setIsReordering] = useState(false);

  // Formatting date
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleReorder = async () => {
    setIsReordering(true);
    await onReorder(order);
    setTimeout(() => setIsReordering(false), 2000); // Reset state after success feedback
  };

  return (
    <div className="order-card-responsive" style={{
      background: '#FFFDF5', // Warm pale yellow/cream
      border: '1px solid rgba(93, 64, 55, 0.1)',
      borderRadius: '12px',
      padding: 'clamp(16px, 4vw, 24px)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      boxSizing: 'border-box'
    }}>
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ minWidth: 0, flex: '1 1 auto' }}>
          <h3 style={{
            fontFamily: "'Literata', Georgia, serif",
            fontSize: 'clamp(16px, 2.5vw, 18px)',
            fontWeight: 700,
            color: '#1C1007',
            margin: '0 0 4px 0'
          }}>
            Order #{order.id}
          </h3>
          <p style={{
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontSize: '14px',
            color: '#5D4037',
            margin: 0
          }}>
            Placed on {formattedDate} {order.expectedDelivery && `• ${order.expectedDelivery}`}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Items Preview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {/* Render up to 2 images */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {order.items.slice(0, 2).map((item, index) => (
            <div key={index} className="order-card-thumbnail" style={{
              width: '60px',
              height: '60px',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid rgba(93, 64, 55, 0.1)',
              background: '#FFF',
              flexShrink: 0,
            }}>
              <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
        
        <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '14px', color: '#3D2B1F', fontWeight: 500 }}>
          {order.items.length === 1 ? (
            <span>1 item</span>
          ) : order.items.length === 2 ? (
            <span>2 items</span>
          ) : (
            <span>+ {order.items.length - 2} more items</span>
          )}
        </div>
        
        {/* If it's a single item, we could show its name, but the design mostly groups them if many. 
            The reference for ORDER 3 shows "Complete Thali Meal Pack". 
            Let's show the name if there's only 1 item, otherwise item count. */}
        {order.items.length === 1 && (
          <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '14px', color: '#3D2B1F', fontWeight: 600 }}>
            {order.items[0].name}
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(93, 64, 55, 0.1)', width: '100%' }} />

      {/* Footer Row */}
      <div className="order-card-footer">
        <div style={{
          fontFamily: "'Literata', Georgia, serif",
          fontSize: '18px',
          fontWeight: 600,
          color: '#1C1007',
        }}>
          Total: ₹{order.total}
        </div>

        <div className="order-card-actions">
          {order.status === 'delivered' && (
            <>
              <button
                onClick={() => navigate(`/orders/${order.id}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: 'transparent',
                  border: '1px solid #5D4037',
                  color: '#1C1007',
                  padding: '10px 16px',
                  borderRadius: '24px',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(93, 64, 55, 0.04)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                aria-label={`View details for order ${order.id}`}
              >
                View Details
              </button>
              <button
                onClick={handleReorder}
                disabled={isReordering}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: '#B22222',
                  border: 'none',
                  color: '#FFF',
                  padding: '10px 16px',
                  borderRadius: '24px',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: isReordering ? 'default' : 'pointer',
                  transition: 'background 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => !isReordering && (e.currentTarget.style.background = '#8B1A1A')}
                onMouseLeave={(e) => !isReordering && (e.currentTarget.style.background = '#B22222')}
                aria-label={`Reorder items from order ${order.id}`}
              >
                <ShoppingBag size={14} />
                {isReordering ? 'Added to cart' : 'Reorder'}
              </button>
            </>
          )}

          {order.status === 'in-transit' && (
            <button
              onClick={() => navigate(`/orders/${order.id}/track`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                background: 'transparent',
                border: '1px solid #5D4037',
                color: '#1C1007',
                padding: '10px 16px',
                borderRadius: '24px',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(93, 64, 55, 0.04)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              aria-label={`Track order ${order.id}`}
            >
              <MapPin size={14} />
              Track Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
