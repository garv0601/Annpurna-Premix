import React from 'react';

export default function OrderSummary({ order }) {
  // Support both real Supabase order shape and mock shape for backward compatibility.
  // Real shape: order.subtotal, order.discount, order.deliveryFee, order.taxAmount, order.total
  // Fallback: calculate from items if subtotal not available

  const subtotal = typeof order.subtotal !== 'undefined'
    ? order.subtotal
    : (order.items || []).reduce((sum, item) => sum + (item.price || item.product_price || 0) * item.quantity, 0);

  const hasDelivery = typeof order.deliveryFee !== 'undefined' && order.deliveryFee > 0;
  const hasDiscount = typeof order.discount !== 'undefined' && order.discount > 0;
  const hasTax      = typeof order.taxAmount !== 'undefined' && order.taxAmount > 0;

  const rowStyle = {
    display:        'flex',
    justifyContent: 'space-between',
    fontFamily:     "'Be Vietnam Pro', sans-serif",
    fontSize:       '14px',
    color:          '#5D4037',
    marginBottom:   '12px'
  };

  return (
    <div style={{
      background:   'rgba(93, 64, 55, 0.03)',
      borderRadius: '8px',
      padding:      '24px',
      marginTop:    '24px'
    }}>
      <div style={rowStyle}>
        <span>Subtotal</span>
        <span style={{ fontWeight: 500, color: '#1C1007' }}>₹{Number(subtotal).toLocaleString('en-IN')}</span>
      </div>

      {hasDelivery && (
        <div style={rowStyle}>
          <span>Delivery</span>
          <span style={{ fontWeight: 500, color: '#1C1007' }}>₹{Number(order.deliveryFee).toLocaleString('en-IN')}</span>
        </div>
      )}

      {hasDiscount && (
        <div style={{ ...rowStyle, color: '#2F8B57' }}>
          <span>Discount</span>
          <span style={{ fontWeight: 500 }}>−₹{Number(order.discount).toLocaleString('en-IN')}</span>
        </div>
      )}

      {hasTax && (
        <div style={rowStyle}>
          <span>Taxes</span>
          <span style={{ fontWeight: 500, color: '#1C1007' }}>₹{Number(order.taxAmount).toLocaleString('en-IN')}</span>
        </div>
      )}

      <div style={{ height: '1px', background: 'rgba(93, 64, 55, 0.1)', margin: '16px 0' }} />

      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        fontFamily:     "'Literata', Georgia, serif",
        fontSize:       '18px',
        fontWeight:     600,
        color:          '#1C1007',
      }}>
        <span>Total</span>
        <span>₹{Number(order.total).toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}
