import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';

// Pool of rotating tips shown when no custom tip (children) is provided.
const TIPS = [
  "Keep your delivery address updated so your fresh premixes always reach you hot and fast!",
  "Store your premixes in a cool, dry place to keep them fresh for longer.",
  "Add items to your wishlist so you never lose track of your favourites.",
  "Reorder your favourite premix in just one click from My Orders.",
  "Apply a coupon code at checkout to save more on your order.",
  "Follow the pack instructions for the perfect consistency every time."
];

const ROTATE_INTERVAL_MS = 8000;

export default function MaasTip({ children }) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Only auto-rotate the built-in tips; a custom tip passed via children stays static.
    if (children) return;
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [children]);

  const tipText = children || TIPS[tipIndex];

  return (
    <div style={{
      background: '#FFC300',
      borderRadius: '12px',
      padding: '24px',
      height: '100%',
      color: '#3D2B1F',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <Lightbulb size={20} />
        <h3 style={{
          fontFamily: "'Literata', Georgia, serif",
          fontSize: '18px',
          fontWeight: 600,
          margin: 0
        }}>
          Maa's Tip
        </h3>
      </div>
      <p style={{
        fontFamily: "'Be Vietnam Pro', sans-serif",
        fontSize: '14px',
        lineHeight: 1.5,
        margin: 0
      }}>
        {tipText}
      </p>
    </div>
  );
}
