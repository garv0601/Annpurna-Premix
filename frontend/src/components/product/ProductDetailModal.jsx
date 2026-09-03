import React, { useState } from 'react';
import Modal from '../common/Modal';
import RatingStars from '../common/RatingStars';
import Badge from '../common/Badge';
import Button from '../common/Button';
import ReviewList from '../reviews/ReviewList';
import ReviewForm from '../reviews/ReviewForm';
import { useReviews } from '../../hooks/useReviews';
import { formatCurrency } from '../../utils/formatters';
import { ShoppingBag, Check, ShieldAlert, Cpu } from 'lucide-react';

export const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [activeTab, setActiveTab] = useState('specs');
  const { reviews, loading: reviewsLoading, addReview } = useReviews(product?.id);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Main Header Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                {product.badge && <Badge variant="cyan">{product.badge}</Badge>}
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{product.brand}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <RatingStars rating={product.rating} size={16} />
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  {product.rating} ({product.reviewCount} customer reviews)
                </span>
              </div>

              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                {product.description}
              </p>
            </div>

            <div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-cyan)', marginBottom: '16px' }}>
                {formatCurrency(product.price)}
              </div>

              <Button
                variant="primary"
                size="md"
                icon={added ? Check : ShoppingBag}
                onClick={handleAdd}
                style={{ width: '100%' }}
              >
                {added ? 'Added to Cart!' : 'Add to Shopping Cart'}
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div style={{ borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '16px' }}>
          <button
            onClick={() => setActiveTab('specs')}
            style={{
              padding: '10px 16px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'specs' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              color: activeTab === 'specs' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              padding: '10px 16px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'reviews' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              color: activeTab === 'reviews' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Customer Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'specs' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {product.features && (
              <div>
                <h4 style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--text-main)' }}>Key Engineering Highlights</h4>
                <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.8' }}>
                  {product.features.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.specs && (
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '14px', marginBottom: '10px', color: 'var(--accent-blue)' }}>Hardware Architecture</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key}>
                      <span style={{ color: 'var(--text-dim)' }}>{key}: </span>
                      <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ReviewForm onSubmit={addReview} />
            <ReviewList reviews={reviews} loading={reviewsLoading} />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ProductDetailModal;
