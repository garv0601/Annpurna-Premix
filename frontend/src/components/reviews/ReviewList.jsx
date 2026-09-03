import React from 'react';
import ReviewCard from './ReviewCard';
import { MessageSquare } from 'lucide-react';

export const ReviewList = ({ reviews = [], loading = false }) => {
  if (loading) {
    return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
        <MessageSquare size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
        <p style={{ fontSize: '14px' }}>No reviews yet for this product. Be the first to share your feedback!</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {reviews.map((rev) => (
        <ReviewCard key={rev.id} review={rev} />
      ))}
    </div>
  );
};

export default ReviewList;
