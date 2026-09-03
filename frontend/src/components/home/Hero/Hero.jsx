import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { staggerContainer, fadeUp, imageReveal, viewportOnce } from '../../../utils/animations';

// ── Decorative dot pattern SVG (small, subtle, warm) ──
const DotPattern = () => (
  <svg
    width="96"
    height="96"
    viewBox="0 0 96 96"
    fill="none"
    aria-hidden="true"
    style={{ position: 'absolute', opacity: 0.55 }}
  >
    {[0, 12, 24, 36, 48, 60, 72, 84].map((x) =>
      [0, 12, 24, 36, 48, 60, 72, 84].map((y) => (
        <circle key={`${x}-${y}`} cx={x + 6} cy={y + 6} r={2} fill="#FFC300" />
      ))
    )}
  </svg>
);

export default function Hero({ onExploreClick }) {
  const shouldReduce = useReducedMotion();

  const variants = shouldReduce
    ? { hidden: {}, visible: {} }
    : { hidden: {}, visible: {} };

  return (
    <section
      aria-label="Hero — Brand positioning"
      style={{
        background: '#FFF8F4',
        paddingTop: 'clamp(100px, 14vw, 140px)',
        paddingBottom: 'clamp(60px, 8vw, 90px)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'clamp(40px, 6vw, 72px)',
          alignItems: 'center',
        }}
        id="hero-grid"
      >
        {/* ── LEFT: Copy ── */}
        <motion.div
          variants={shouldReduce ? {} : staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ maxWidth: '580px' }}
        >
          {/* Eyebrow */}
          <motion.p
            variants={shouldReduce ? {} : fadeUp}
            style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#B22222',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '28px',
                height: '2px',
                background: '#B22222',
                borderRadius: '1px',
              }}
            />
            Traditional Indian Food • Made Simple
          </motion.p>

          {/* Main Heading */}
          <motion.h1
            variants={shouldReduce ? {} : fadeUp}
            style={{
              fontFamily: "'Literata', Georgia, serif",
              fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)',
              fontWeight: 500,
              color: '#1C1007',
              lineHeight: 1.15,
              marginBottom: '24px',
              fontStyle: 'normal',
            }}
          >
            Ghar jaisa.
            <br />
            <em style={{ fontStyle: 'italic', color: '#B22222' }}>Maa ke haath jaisa.</em>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={shouldReduce ? {} : fadeUp}
            style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: 'clamp(15px, 1.8vw, 17px)',
              color: '#5D4037',
              lineHeight: 1.7,
              marginBottom: '36px',
              maxWidth: '460px',
            }}
          >
            Traditional Indian flavours, thoughtfully prepared as easy-to-cook
            premixes for everyday meals.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={shouldReduce ? {} : fadeUp}
            style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}
          >
            <button
              id="hero-cta-shop"
              onClick={onExploreClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#B22222',
                color: '#fff',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '15px',
                fontWeight: 600,
                padding: '13px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.18s, transform 0.18s',
                boxShadow: '0 4px 14px rgba(178, 34, 34, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#8B1A1A';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#B22222';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Shop Premixes
              <ArrowRight size={16} />
            </button>

            <Link
              to="/story"
              id="hero-cta-story"
              style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: '#5D4037',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(93, 64, 55, 0.35)',
                paddingBottom: '2px',
                transition: 'color 0.18s, border-color 0.18s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#B22222';
                e.currentTarget.style.borderColor = '#B22222';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#5D4037';
                e.currentTarget.style.borderColor = 'rgba(93, 64, 55, 0.35)';
              }}
            >
              Discover Annpurna
            </Link>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Image ── */}
        <motion.div
          variants={shouldReduce ? {} : imageReveal}
          initial="hidden"
          animate="visible"
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
          }}
          id="hero-image-col"
        >
          {/* Decorative elements */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '-24px',
              right: '-8px',
              zIndex: 0,
            }}
          >
            <DotPattern />
          </div>
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '-20px',
              left: '-16px',
              zIndex: 0,
              transform: 'rotate(180deg)',
              opacity: 0.45,
            }}
          >
            <DotPattern />
          </div>

          {/* Accent Ring */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: '100%',
              maxWidth: '460px',
              height: '100%',
              borderRadius: '50% 50% 40% 60% / 50% 40% 60% 50%',
              border: '2px solid rgba(255, 195, 0, 0.3)',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />

          {/* Food Image */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              maxWidth: '500px',
              borderRadius: '50% 48% 52% 48% / 46% 52% 48% 54%',
              overflow: 'hidden',
              aspectRatio: '1 / 1',
              boxShadow: '0 20px 60px rgba(93, 64, 55, 0.2), 0 6px 18px rgba(93, 64, 55, 0.12)',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=700&q=85&auto=format&fit=crop"
              alt="Authentic Indian thali spread with dals, rice and freshly made rotis — homemade warmth"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          </div>

          {/* Floating badge */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '0',
              zIndex: 2,
              background: '#FFF8F4',
              border: '1px solid rgba(93, 64, 55, 0.12)',
              borderRadius: '10px',
              padding: '12px 16px',
              boxShadow: '0 4px 16px rgba(93, 64, 55, 0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              maxWidth: '210px',
            }}
          >
            <span style={{ fontSize: '28px', lineHeight: 1 }} aria-hidden="true">🍲</span>
            <div>
              <div
                style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1C1007',
                  lineHeight: 1.2,
                  marginBottom: '2px',
                }}
              >
                Ready in minutes
              </div>
              <div
                style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: '11px',
                  color: '#7A5C4A',
                }}
              >
                Traditional flavours preserved
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hero responsive layout */}
      <style>{`
        @media (min-width: 900px) {
          #hero-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          #hero-image-col {
            justify-content: flex-end !important;
          }
        }
      `}</style>
    </section>
  );
}
