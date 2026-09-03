import React from 'react';
import { Lightbulb } from 'lucide-react';

export default function MaasTip({ children }) {
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
        {children || "Keep your delivery address updated so your fresh premixes always reach you hot and fast!"}
      </p>
    </div>
  );
}
