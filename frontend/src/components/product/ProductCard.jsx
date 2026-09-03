import React from 'react';
import { ShoppingBag, Eye } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import RatingStars from '../common/RatingStars';
import Badge from '../common/Badge';
import Button from '../common/Button';

export const ProductCard = ({ product, onQuickView, onAddToCart }) => {
  return (
    <div
      className="glass-panel glow-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Product Image & Badge */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
        />
        {product.badge && (
          <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
            <Badge variant="cyan">{product.badge}</Badge>
          </div>
        )}

        <button
          onClick={() => onQuickView(product)}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(9, 11, 16, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-color)',
            color: '#fff',
            borderRadius: '50%',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition-fast)'
          }}
          title="Quick View"
        >
          <Eye size={16} />
        </button>
      </div>

      {/* Card Content */}
      <div style={{ padding: 'clamp(12px, 3vw, 20px)', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', minWidth: 0 }}>
        <div>
          <span style={{ fontSize: '12px', color: 'var(--accent-blue)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {product.category} • {product.brand}
          </span>

          <h3
            style={{
              fontSize: '17px',
              fontWeight: '700',
              margin: '6px 0 10px',
              color: 'var(--text-main)',
              lineHeight: '1.3'
            }}
          >
            {product.name}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <RatingStars rating={product.rating} size={14} />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'clamp(4px, 2vw, 10px)', flexWrap: 'wrap' }}>
          <div style={{ flexShrink: 1, minWidth: 0 }}>
            <span style={{ fontSize: 'clamp(15px, 4vw, 18px)', fontWeight: '800', color: 'var(--accent-cyan)', whiteSpace: 'nowrap' }}>
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: '13px', color: 'var(--text-dim)', textDecoration: 'line-through', marginLeft: '6px', whiteSpace: 'nowrap' }}>
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <div style={{ flexShrink: 0, minWidth: 0, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" size="sm" icon={ShoppingBag} onClick={() => onAddToCart(product)} style={{ padding: 'clamp(6px, 1.5vw, 8px) clamp(10px, 2.5vw, 14px)', fontSize: 'clamp(11px, 2.5vw, 12px)', whiteSpace: 'nowrap', minWidth: 0 }}>
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
