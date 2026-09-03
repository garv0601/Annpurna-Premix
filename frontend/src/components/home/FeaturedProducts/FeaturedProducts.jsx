import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { staggerContainer, fadeUp, viewportOnce } from '../../../utils/animations';
import { useActiveProducts } from '../../../hooks/useActiveProducts';

const badgeColors = {
  Bestseller: { bg: '#FFF0CC', color: '#8B6914', border: '#F0D060' },
  Popular:    { bg: '#FDECEA', color: '#B22222', border: '#E09090' },
  New:        { bg: '#E8F5EE', color: '#1E6B3E', border: '#87C9A4' },
};

// ── Quantity stepper: replaces "Add" button when qty > 0 ──
function QuantityStepper({ qty, onDecrement, onIncrement }) {
  return (
    <motion.div
      key="stepper"
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        borderRadius: '7px',
        border: '1.5px solid #B22222',
        overflow: 'hidden',
        background: '#fff',
      }}
    >
      <button
        onClick={onDecrement}
        aria-label="Decrease quantity"
        style={{
          background: 'transparent',
          border: 'none',
          color: '#B22222',
          width: '32px',
          height: '36px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: '16px',
          transition: 'background 0.14s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(178,34,34,0.07)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <Minus size={13} strokeWidth={2.5} />
      </button>

      <span
        style={{
          fontFamily: "'Be Vietnam Pro', sans-serif",
          fontSize: '13px',
          fontWeight: 700,
          color: '#1C1007',
          minWidth: '20px',
          textAlign: 'center',
          lineHeight: 1,
          padding: '0 2px',
          userSelect: 'none',
        }}
      >
        {qty}
      </span>

      <button
        onClick={onIncrement}
        aria-label="Increase quantity"
        style={{
          background: '#B22222',
          border: 'none',
          color: '#fff',
          width: '32px',
          height: '36px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 0.14s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#8B1A1A')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#B22222')}
      >
        <Plus size={13} strokeWidth={2.5} />
      </button>
    </motion.div>
  );
}

// ── Add button ──
function AddButton({ onClick, productName }) {
  return (
    <motion.button
      key="add"
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClick}
      aria-label={`Add ${productName} to cart`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        background: '#B22222',
        color: '#fff',
        border: 'none',
        borderRadius: '7px',
        padding: '8px 16px',
        height: '36px',
        fontSize: '13px',
        fontWeight: 600,
        fontFamily: "'Be Vietnam Pro', sans-serif",
        cursor: 'pointer',
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
      }}
      whileHover={{ background: '#8B1A1A', scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
    >
      <Plus size={13} strokeWidth={2.5} />
      Add
    </motion.button>
  );
}

// ── ProductCard ──
// Props:
//   product      — the product data object
//   cartQty      — current quantity of this product in cart (0 if not in cart)
//   onAdd        — called to add product to cart (does NOT open cart drawer)
//   onIncrement  — called to +1 quantity
//   onDecrement  — called to -1 quantity (removes if qty reaches 0)
function ProductCard({ product, cartQty, onAdd, onIncrement, onDecrement }) {
  const badge   = badgeColors[product.badge];
  const inCart  = cartQty > 0;
  const soldOut = (product.stock_quantity ?? 0) <= 1;

  // ── Sold-out card ──────────────────────────────────────────────
  if (soldOut) {
    return (
      <motion.article
        variants={fadeUp}
        aria-label={`${product.name} — Sold out`}
        style={{
          background: '#F7F4F1',
          border: '1px solid rgba(93, 64, 55, 0.08)',
          borderRadius: '14px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          opacity: 0.7,
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        {/* Image — NOT a link */}
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            aspectRatio: '4/3',
            background: '#EDE9E4',
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
              filter: 'grayscale(55%) brightness(0.92)',
            }}
          />
          <span
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'rgba(60, 50, 45, 0.82)',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
              padding: '3px 9px',
              borderRadius: '20px',
              fontFamily: "'Be Vietnam Pro', sans-serif",
            }}
          >
            Sold Out
          </span>
        </div>

        {/* Content */}
        <div
          style={{
            padding: 'clamp(12px, 3vw, 18px) clamp(12px, 3vw, 18px) 16px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minWidth: 0,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#B0A090',
                marginBottom: '4px',
              }}
            >
              {product.category}
            </p>
            <h3
              style={{
                fontFamily: "'Literata', Georgia, serif",
                fontSize: 'clamp(14px, 2vw, 16px)',
                fontWeight: 500,
                color: '#9A8878',
                lineHeight: 1.3,
                marginBottom: '6px',
              }}
            >
              {product.name}
            </h3>
            <p
              style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '13px',
                color: '#B0A090',
                lineHeight: 1.55,
              }}
            >
              {product.shortDescription}
            </p>
          </div>

          <div
            className="product-card-bottom"
            style={{
              marginTop: 'auto',
              paddingTop: '12px',
              borderTop: '1px solid rgba(93, 64, 55, 0.06)',
            }}
          >
            <div className="price-pack-container">
              <div
                style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#B0A090',
                  lineHeight: 1,
                }}
              >
                {product.currency}{product.price}
              </div>
              <div
                style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: '12px',
                  color: '#C0B0A0',
                  marginTop: '4px',
                  lineHeight: 1.3,
                }}
              >
                {product.packSize}
              </div>
            </div>
            <div className="product-action-container">
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(93, 64, 55, 0.08)',
                  color: '#9A8878',
                  border: '1.5px solid rgba(93, 64, 55, 0.15)',
                  borderRadius: '7px',
                  padding: '8px 14px',
                  height: '36px',
                  fontSize: '12px',
                  fontWeight: 600,
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                }}
              >
                Sold Out
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  // ── Normal (in-stock) card — unchanged ─────────────────────────
  return (
    <motion.article
      variants={fadeUp}
      style={{
        background: '#FFFBF7',
        border: '1px solid rgba(93, 64, 55, 0.1)',
        borderRadius: '14px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      }}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(93, 64, 55, 0.14)' }}
      aria-label={`${product.name} — ${product.currency}${product.price}`}
    >
      {/* Image — links to product detail */}
      <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }} aria-label={`View ${product.name} details`}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            aspectRatio: '4/3',
            background: '#FEF4EC',
          }}
        >
          <motion.img
            src={product.image}
            alt={`${product.name} — ${product.shortDescription}`}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
            }}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
          {product.badge && badge && (
            <span
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: badge.bg,
                color: badge.color,
                border: `1px solid ${badge.border}`,
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '3px 9px',
                borderRadius: '20px',
                fontFamily: "'Be Vietnam Pro', sans-serif",
              }}
            >
              {product.badge}
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div
        style={{
          padding: 'clamp(12px, 3vw, 18px) clamp(12px, 3vw, 18px) 16px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minWidth: 0,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#A8816A',
              marginBottom: '4px',
            }}
          >
            {product.category}
          </p>
          <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3
              style={{
                fontFamily: "'Literata', Georgia, serif",
                fontSize: 'clamp(14px, 2vw, 16px)',
                fontWeight: 500,
                color: '#1C1007',
                lineHeight: 1.3,
                marginBottom: '6px',
                cursor: 'pointer',
              }}
            >
              {product.name}
            </h3>
          </Link>
          <p
            style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: '13px',
              color: '#7A5C4A',
              lineHeight: 1.55,
            }}
          >
            {product.shortDescription}
          </p>
        </div>

        {/* Price + Cart Action */}
        <div
          className="product-card-bottom"
          style={{
            marginTop: 'auto',
            paddingTop: '12px',
            borderTop: '1px solid rgba(93, 64, 55, 0.08)',
          }}
        >
          <div className="price-pack-container">
            <div
              style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '18px',
                fontWeight: 700,
                color: '#B22222',
                lineHeight: 1,
              }}
            >
              {product.currency}{product.price}
            </div>
            <div
              style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '12px',
                color: '#A8816A',
                marginTop: '4px',
                lineHeight: 1.3,
              }}
            >
              {product.packSize}
            </div>
          </div>

          {/* Animated toggle: Add button ↔ Quantity stepper */}
          <div className="product-action-container">
            <AnimatePresence mode="wait" initial={false}>
              {inCart ? (
                <QuantityStepper
                  key="stepper"
                  qty={cartQty}
                  onDecrement={onDecrement}
                  onIncrement={onIncrement}
                />
              ) : (
                <AddButton
                  key="add"
                  productName={product.name}
                  onClick={onAdd}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ── FeaturedProducts section ──
// Receives cart state via props so the cards stay in sync with CartDrawer
export default function FeaturedProducts({ cartItems = [], onAddToCartRaw, onUpdateQuantity }) {
  // Fetch is_active = true products from Supabase (same logic as Shop page)
  const { products: featuredProducts, loading, error } = useActiveProducts();

  // Look up cart quantity for a product by ID
  const getQty = (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <section
      id="shop"
      aria-label="Featured premix products"
      style={{
        background: '#FFF8F4',
        padding: 'clamp(60px, 8vw, 100px) 0',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: 'clamp(32px, 5vw, 52px)',
          }}
        >
          <motion.div variants={fadeUp}>
            <p
              style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                color: '#B22222',
                marginBottom: '10px',
              }}
            >
              Our Collection
            </p>
            <h2
              style={{
                fontFamily: "'Literata', Georgia, serif",
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                fontWeight: 500,
                color: '#1C1007',
                lineHeight: 1.2,
                marginBottom: '10px',
              }}
            >
              Popular Premixes
            </h2>
            <p
              style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '15px',
                color: '#7A5C4A',
              }}
            >
              Little shortcuts to meals that still feel like home.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Link
              to="/shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                color: '#B22222',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(178, 34, 34, 0.35)',
                paddingBottom: '2px',
                transition: 'border-color 0.18s',
                whiteSpace: 'nowrap',
              }}
            >
              View all premixes
              <ArrowRight size={15} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          // Loading spinner — matches the shop page pattern
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '180px',
              flexDirection: 'column',
              gap: '12px',
              color: '#7A5C4A',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: '14px',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                border: '3px solid rgba(178, 34, 34, 0.15)',
                borderTopColor: '#B22222',
                borderRadius: '50%',
                animation: 'fp-spin 0.7s linear infinite',
              }}
            />
            Loading products…
          </div>
        ) : error || featuredProducts.length === 0 ? (
          // Empty / error state — show nothing rather than broken cards
          <div
            style={{
              textAlign: 'center',
              padding: 'clamp(24px, 4vw, 48px) 20px',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              color: '#A8816A',
              fontSize: '14px',
            }}
          >
            {error
              ? 'Unable to load products. Please refresh the page.'
              : 'No featured products available right now.'}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
              gap: 'clamp(14px, 2.5vw, 26px)',
            }}
            id="products-grid"
          >
            {featuredProducts.map((product) => {
              const qty = getQty(product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  cartQty={qty}
                  onAdd={() => onAddToCartRaw && onAddToCartRaw(product)}
                  onIncrement={() => onUpdateQuantity && onUpdateQuantity(product.id, qty + 1)}
                  onDecrement={() => onUpdateQuantity && onUpdateQuantity(product.id, qty - 1)}
                />
              );
            })}
          </motion.div>
        )}
      </div>

      <style>{`
        @keyframes fp-spin {
          to { transform: rotate(360deg); }
        }
        @media (min-width: 900px) {
          #products-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        @media (max-width: 414px) {
          #products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 350px) {
          #products-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
        /* Responsive product card bottom layout */
        .product-card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .price-pack-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 0;
        }
        .product-action-container {
          flex-shrink: 0;
          display: flex;
          justify-content: flex-end;
        }
        
        @media (max-width: 767px) {
          .product-card-bottom {
            flex-direction: column;
            align-items: stretch;
            justify-content: flex-start;
            gap: 12px;
          }
          .product-action-container {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
