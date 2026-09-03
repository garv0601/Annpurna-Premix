import React from 'react';

export default function OrderItem({ item }) {
  // Support both real Supabase order_items shape and mock shape
  const name      = item.name      || item.product_name  || 'Product';
  const price     = item.price     || item.product_price || 0;
  const image     = item.image     || `https://placehold.co/80x80/FFF8F4/B22222?text=${encodeURIComponent(name.slice(0, 2))}`;
  const itemTotal = item.subtotal  || (price * item.quantity);

  return (
    <div className="order-item-row" style={{
      padding:      '16px 0',
      borderBottom: '1px solid rgba(93, 64, 55, 0.1)',
      display:      'flex',
      alignItems:   'center',
      gap:          '16px',
    }}>
      <div className="order-item-image" style={{
        width:        '80px',
        height:       '80px',
        borderRadius: '8px',
        overflow:     'hidden',
        border:       '1px solid rgba(93, 64, 55, 0.1)',
        background:   '#FFF',
        flexShrink:   0
      }}>
        <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{
          fontFamily:   "'Literata', Georgia, serif",
          fontSize:     '16px',
          fontWeight:   600,
          color:        '#1C1007',
          margin:       '0 0 4px 0',
          overflowWrap: 'break-word',
        }}>
          {name}
        </h4>
        <div style={{
          fontFamily: "'Be Vietnam Pro', sans-serif",
          fontSize:   '14px',
          color:      '#5D4037',
        }}>
          Qty: {item.quantity} <span style={{ opacity: 0.6 }}>•</span> ₹{price} each
        </div>
      </div>

      <div style={{
        fontFamily: "'Be Vietnam Pro', sans-serif",
        fontSize:   '16px',
        fontWeight: 600,
        color:      '#1C1007',
        whiteSpace: 'nowrap',
      }}>
        ₹{Number(itemTotal).toLocaleString('en-IN')}
      </div>
    </div>
  );
}

