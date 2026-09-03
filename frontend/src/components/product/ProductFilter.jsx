import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const ProductFilter = ({ filters, setFilters, onReset }) => {
  const categories = ['All', 'Audio', 'Peripherals', 'Wearables', 'Desk Setup'];

  return (
    <div
      className="glass-panel"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={18} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '16px' }}>Filter Catalog</h3>
        </div>
        <button
          onClick={onReset}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-dim)',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Category Selection */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>
          Category
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
              style={{
                textAlign: 'left',
                padding: '8px 12px',
                borderRadius: '8px',
                background: (filters.category || 'All') === cat ? 'rgba(0, 242, 254, 0.12)' : 'transparent',
                border: (filters.category || 'All') === cat ? '1px solid var(--border-glow)' : '1px solid transparent',
                color: (filters.category || 'All') === cat ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Max Price Range Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Max Price</span>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>
            {formatCurrency(filters.maxPrice || 700)}
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="700"
          step="10"
          value={filters.maxPrice || 700}
          onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
          style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
        />
      </div>

      {/* Sort By Dropdown */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          Sort Results
        </label>
        <select
          value={filters.sortBy || ''}
          onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'var(--text-main)',
            fontSize: '14px',
            outline: 'none'
          }}
        >
          <option value="" style={{ background: '#090b10' }}>Featured</option>
          <option value="price-asc" style={{ background: '#090b10' }}>Price: Low to High</option>
          <option value="price-desc" style={{ background: '#090b10' }}>Price: High to Low</option>
          <option value="rating" style={{ background: '#090b10' }}>Highest Customer Rating</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilter;
