import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Check, ArrowRight, Truck } from 'lucide-react';
import { getOrderById } from '../../services/orderService';
import supabase from '../../lib/supabase';
import './OrderSuccessPage.css';

const formatPrice = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

/**
 * Build a customer-friendly display reference from the real order UUID.
 * The real database ID is preserved and used for all lookups — this is
 * display-only formatting (e.g. "#ANN-3F9A2-IN").
 */
function formatOrderRef(id) {
  if (!id) return '#ANN-XXXXX-IN';
  const code = String(id).replace(/[^a-z0-9]/gi, '').slice(0, 5).toUpperCase();
  return `#ANN-${code}-IN`;
}

/**
 * Isolated estimated-delivery calculation. The DB has no delivery-date field,
 * so this is derived on the frontend from the order date + a delivery window.
 * Kept standalone so it can be replaced with a server-provided date later.
 */
function estimateDelivery(createdAt, deliveryMethod) {
  const base = createdAt ? new Date(createdAt) : new Date();
  const daysToAdd = deliveryMethod === 'express' ? 2 : 5;
  const eta = new Date(base);
  eta.setDate(eta.getDate() + daysToAdd);
  return eta.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Hint passed from checkout (optional — page stays refresh-safe without it).
  const deliveryMethod = location.state?.deliveryMethod;

  const [order, setOrder] = useState(null);
  const [productMeta, setProductMeta] = useState({}); // productId -> { image, weight }
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadOrder() {
      if (!orderId) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        // Source of truth: the server-confirmed order (real items, totals, status).
        const fetched = await getOrderById(orderId);
        if (cancelled) return;
        setOrder(fetched);

        // Enrich items with real product images / weight from Supabase.
        // order_items don't store images, so we look them up by product_id.
        const ids = (fetched.items || []).map((i) => i.productId).filter(Boolean);
        if (supabase && ids.length > 0) {
          const { data: products } = await supabase
            .from('products')
            .select('id, image_url, weight')
            .in('id', ids);

          if (!cancelled && products) {
            const meta = {};
            for (const p of products) {
              meta[p.id] = { image: p.image_url, weight: p.weight };
            }
            setProductMeta(meta);
          }
        }
      } catch (err) {
        console.error('[OrderSuccess] Failed to load order:', err);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOrder();
    return () => { cancelled = true; };
  }, [orderId]);

  // No valid order context — send the customer somewhere safe.
  if (!loading && (notFound || !order)) {
    return <Navigate to="/" replace />;
  }

  const handleTrackOrder = () => {
    navigate(`/account/orders/${orderId}/track`);
  };

  const isPaid = order?.paymentStatus === 'paid';
  const totalLabel = isPaid ? 'Total Paid' : 'Amount Payable';

  return (
    <div className="order-success-page">
      <motion.div
        className="order-success-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {loading ? (
          <div className="order-success-body">
            <div className="order-success-status">
              <div className="order-success-spinner" />
              Loading your order…
            </div>
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <div className="order-success-header">
              <motion.div
                className="order-success-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
              >
                <Check size={28} color="#5A4200" strokeWidth={3} />
              </motion.div>
              <h1 className="order-success-title">Shubh Ho!</h1>
              <p className="order-success-subtitle">
                Your order has been placed successfully. It's in Maa's hands now.
              </p>
            </div>

            {/* ── Body ── */}
            <div className="order-success-body">
              <div className="order-meta-row">
                <div className="order-meta-block">
                  <span className="order-meta-label">Order ID</span>
                  <span className="order-meta-value">{formatOrderRef(order.id)}</span>
                </div>
                <div className="order-meta-block text-right">
                  <span className="order-meta-label">Estimated Delivery</span>
                  <span className="order-meta-value delivery">
                    {estimateDelivery(order.createdAt, deliveryMethod)}
                  </span>
                </div>
              </div>

              <hr className="order-success-divider" />

              <h2 className="order-summary-heading">Order Summary</h2>
              <div className="order-item-list">
                {order.items.map((item) => {
                  const meta = productMeta[item.productId] || {};
                  const image = meta.image || item.image;
                  const weight = meta.weight;
                  return (
                    <div className="order-item" key={item.productId + '-' + item.name}>
                      <img
                        className="order-item-thumb"
                        src={image}
                        alt={item.name}
                        loading="lazy"
                      />
                      <div className="order-item-info">
                        <p className="order-item-name">{item.name}</p>
                        <span className="order-item-meta">
                          Qty: {item.quantity}{weight ? ` × ${weight}` : ''}
                        </span>
                      </div>
                      <span className="order-item-price">
                        {formatPrice(item.subtotal ?? item.price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="order-total-box">
                <span className="order-total-label">{totalLabel}</span>
                <span className="order-total-amount">{formatPrice(order.total)}</span>
              </div>

              <div className="order-success-actions">
                <button className="order-btn order-btn-primary" onClick={handleTrackOrder}>
                  <Truck size={18} /> Track Order
                </button>
                <button
                  className="order-btn order-btn-secondary"
                  onClick={() => navigate('/')}
                >
                  Continue Shopping <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* ── Tip footer ── */}
            <div className="order-success-tip">
              <strong>Maa's Tip:</strong> We'll send you an email with the tracking
              details shortly. Check your spam folder just in case!
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
