import React from 'react';
import { ArrowRight, Sparkles, Shield, Cpu, Volume2 } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export const HeroBanner = ({ onExploreClick }) => {
  return (
    <section
      style={{
        position: 'relative',
        padding: '80px 0 60px',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}
      >
        {/* Left Column: Copy & CTAs */}
        <div>
          <div style={{ marginBottom: '16px' }}>
            <Badge variant="cyan">
              <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
              2026 flagship drop
            </Badge>
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: '1.1',
              marginBottom: '20px'
            }}
          >
            Engineering <br />
            <span className="gradient-text">Pure Acoustic & Digital</span> Supremacy.
          </h1>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '18px',
              maxWidth: '500px',
              marginBottom: '32px',
              lineHeight: '1.6'
            }}
          >
            Immerse yourself in precision-built wireless audio, customized tactile keyboards, and high-performance computing accessories crafted for purists.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <Button variant="primary" size="lg" icon={ArrowRight} onClick={onExploreClick}>
              Explore Collection
            </Button>
            <Button variant="secondary" size="lg" icon={Volume2}>
              Listen Demo Soundstage
            </Button>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: '32px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-cyan)' }}>24-bit</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Lossless Audio</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-purple)' }}>0.2ms</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Ultra Latency</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-neon)' }}>100%</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Aluminum Chassis</div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual showcase */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              height: '420px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(145deg, rgba(0,242,254,0.15), rgba(112,0,255,0.15))',
              border: '1px solid var(--border-glow)',
              padding: '12px',
              position: 'relative',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop"
              alt="Featured Hero Product"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 'var(--radius-md)'
              }}
            />
            {/* Overlay badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '-20px',
                left: '20px',
                background: 'rgba(15, 20, 30, 0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--border-glow)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              <Cpu color="var(--accent-cyan)" size={28} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700' }}>Aether Pulse Pro</div>
                <div style={{ fontSize: '12px', color: 'var(--accent-neon)' }}>Titanium Driver • ANC -45dB</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
