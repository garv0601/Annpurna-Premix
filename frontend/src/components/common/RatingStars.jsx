import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 5, maxRating = 5, size = 16, interactive = false, onChange }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.floor(rating);
        const isHalf = starValue === Math.ceil(rating) && !Number.isInteger(rating);

        return (
          <Star
            key={index}
            size={size}
            onClick={() => interactive && onChange && onChange(starValue)}
            fill={isFilled || isHalf ? '#f59e0b' : 'none'}
            color={isFilled || isHalf ? '#f59e0b' : 'rgba(255, 255, 255, 0.2)'}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              transition: 'var(--transition-fast)'
            }}
          />
        );
      })}
    </div>
  );
};

export default RatingStars;
