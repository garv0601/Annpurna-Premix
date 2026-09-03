import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { staggerContainer, fadeUp, viewportOnce } from '../../../utils/animations';

export default function ShopCTA() {
  return (
    <section
      id="shop-cta"
      aria-label="Shop premixes call to action"
      style={{
        background: '#B22222',
        padding: 'clamp(60px, 8vw, 96px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background texture dots */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '340px',
          height: '340px',
          opacity: 0.07,
          backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '240px',
          height: '240px',
          opacity: 0.06,
          backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)',
          backgroundSize: '18px 18px',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255, 195, 0, 0.9)',
              marginBottom: '16px',
            }}
          >
            Start Cooking
          </motion.p>

          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: "'Literata', Georgia, serif",
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              fontWeight: 500,
              color: '#FFFFFF',
              lineHeight: 1.2,
              marginBottom: '18px',
              maxWidth: '600px',
              margin: '0 auto 18px',
            }}
          >
            Bring a little more home to every meal.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: 'clamp(14px, 1.8vw, 17px)',
              color: 'rgba(255, 248, 244, 0.82)',
              lineHeight: 1.65,
              maxWidth: '460px',
              margin: '0 auto 36px',
            }}
          >
            Discover simple Indian premixes made for everyday cooking.
          </motion.p>

          <motion.div
            variants={fadeUp}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/shop"
              id="shopcta-primary-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFFFFF',
                color: '#B22222',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '15px',
                fontWeight: 700,
                padding: '14px 28px',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'background 0.18s, transform 0.18s',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FFF8F4';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Shop Premixes
              <ArrowRight size={16} />
            </Link>

            <a
              href="#story"
              id="shopcta-story-link"
              style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: 'rgba(255, 248, 244, 0.85)',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255, 248, 244, 0.4)',
                paddingBottom: '2px',
                transition: 'color 0.18s, border-color 0.18s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 248, 244, 0.85)';
                e.currentTarget.style.borderColor = 'rgba(255, 248, 244, 0.4)';
              }}
            >
              Explore Our Story
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
