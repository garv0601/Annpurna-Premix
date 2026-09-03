import React from 'react';
import ProductCard from './ProductCard';
import { PackageX } from 'lucide-react';

export const ProductGrid = ({ products = [], loading = false, onQuickView, onAddToCart }) => {
  if (loading) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
          width: '100%'
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="glass-panel"
            style={{ height: '360px', opacity: 0.5, animation: 'pulse 1.5s infinite ease-in-out' }}
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '60px 20px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--border-color)'
        }}
      >
        <PackageX size={48} color="var(--text-dim)" style={{ marginBottom: '16px' }} />
        <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>No Products Found</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Try clearing your search query or adjusting your category and price filters.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
        gap: 'clamp(14px, 2.5vw, 24px)',
        width: '100%'
      }}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
