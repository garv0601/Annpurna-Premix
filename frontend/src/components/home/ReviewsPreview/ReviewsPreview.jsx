import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { staggerContainer, fadeUp, viewportOnce } from '../../../utils/animations';
import { testimonials } from '../../../data/testimonials';

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', gap: '3px', marginBottom: '12px' }} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={15}
          fill={i < rating ? '#FFC300' : 'transparent'}
          color={i < rating ? '#FFC300' : 'rgba(93, 64, 55, 0.25)'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export default function ReviewsPreview() {
  return (
    <section
      id="reviews"
      aria-label="Customer reviews"
      style={{
        background: '#FEF4EC',
        padding: 'clamp(60px, 8vw, 100px) 0',
      }}
    >
      <div className="container">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          style={{
            textAlign: 'center',
            marginBottom: 'clamp(36px, 5vw, 56px)',
          }}
        >
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.13em',
              textTransform: 'uppercase',
              color: '#2F8B57',
              marginBottom: '12px',
            }}
          >
            Happy Families
          </motion.p>
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: "'Literata', Georgia, serif",
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
              fontWeight: 500,
              color: '#1C1007',
              lineHeight: 1.2,
            }}
          >
            Made for homes.
            <br />
            <em style={{ fontStyle: 'italic', color: '#B22222' }}>Loved by families.</em>
          </motion.h2>
        </motion.div>

        {/* Reviews Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'clamp(16px, 3vw, 28px)',
          }}
          id="reviews-grid"
        >
          {/* DEV NOTE: Placeholder reviews — replace with MongoDB API */}
          {testimonials.map((t) => (
            <motion.blockquote
              key={t.id}
              variants={fadeUp}
              style={{
                background: '#FFFBF7',
                border: '1px solid rgba(93, 64, 55, 0.1)',
                borderRadius: '14px',
                padding: 'clamp(20px, 3vw, 30px)',
                margin: 0,
              }}
            >
              <StarRating rating={t.rating} />

              <p
                style={{
                  fontFamily: "'Literata', Georgia, serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(14px, 1.8vw, 16px)',
                  color: '#3D2B1F',
                  lineHeight: 1.7,
                  marginBottom: '18px',
                }}
              >
                "{t.review}"
              </p>

              <footer
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  borderTop: '1px solid rgba(93, 64, 55, 0.08)',
                  paddingTop: '14px',
                }}
              >
                {/* Avatar initials */}
                <div
                  aria-hidden="true"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#FEF4EC',
                    border: '1.5px solid rgba(178, 34, 34, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#B22222',
                    flexShrink: 0,
                  }}
                >
                  {t.author.charAt(0)}
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#1C1007',
                      lineHeight: 1.2,
                    }}
                  >
                    {t.author}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                      fontSize: '12px',
                      color: '#A8816A',
                    }}
                  >
                    {t.location}
                    {t.productName && ` · ${t.productName}`}
                  </p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>

        {/* View all link */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          style={{ textAlign: 'center', marginTop: '36px' }}
        >
          <a
            href="#reviews"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              color: '#B22222',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(178, 34, 34, 0.3)',
              paddingBottom: '2px',
            }}
          >
            Read all reviews
            <ArrowRight size={15} />
          </a>
        </motion.div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          #reviews-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (min-width: 1024px) {
          #reviews-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
