import React from 'react';
import { CheckCircle } from 'lucide-react';
import RatingStars from '../common/RatingStars';
import { formatDate } from '../../utils/formatters';

export const ReviewCard = ({ review }) => {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h4 style={{ fontSize: '15px', color: 'var(--text-main)' }}>{review.author}</h4>
            {review.verifiedPurchase && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  color: 'var(--accent-neon)',
                  background: 'rgba(0, 255, 170, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}
              >
                <CheckCircle size={10} /> Verified
              </span>
            )}
          </div>
          <RatingStars rating={review.rating} size={14} />
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{formatDate(review.date)}</span>
      </div>

      {review.title && <h5 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>{review.title}</h5>}
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{review.comment}</p>
    </div>
  );
};

export default ReviewCard;
