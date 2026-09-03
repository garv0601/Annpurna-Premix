import React, { useState } from 'react';
import RatingStars from '../common/RatingStars';
import Button from '../common/Button';
import { Send } from 'lucide-react';

export const ReviewForm = ({ onSubmit, submitting = false }) => {
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await onSubmit({ author: author || 'Verified Customer', rating, title, comment });
      setSubmittedMessage('Review posted successfully!');
      setAuthor('');
      setTitle('');
      setComment('');
      setRating(5);
      setTimeout(() => setSubmittedMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <h4 style={{ fontSize: '16px', color: 'var(--text-main)' }}>Write a Verified Review</h4>

      {submittedMessage && (
        <div style={{ color: 'var(--accent-neon)', fontSize: '14px', background: 'rgba(0,255,170,0.1)', padding: '10px', borderRadius: '8px' }}>
          {submittedMessage}
        </div>
      )}

      <div>
        <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Your Rating</label>
        <RatingStars rating={rating} size={22} interactive={true} onChange={(val) => setRating(val)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Your Name</label>
          <input
            type="text"
            placeholder="e.g. Alex Rivera"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: '#fff',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Headline / Title</label>
          <input
            type="text"
            placeholder="e.g. Pure sonic perfection"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: '#fff',
              outline: 'none'
            }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Detailed Review *</label>
        <textarea
          rows={3}
          required
          placeholder="Share your thoughts on build quality, audio clarity, acoustics, or comfort..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: '#fff',
            outline: 'none',
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
        />
      </div>

      <Button type="submit" variant="primary" icon={Send} disabled={submitting}>
        {submitting ? 'Submitting...' : 'Post Review'}
      </Button>
    </form>
  );
};

export default ReviewForm;
