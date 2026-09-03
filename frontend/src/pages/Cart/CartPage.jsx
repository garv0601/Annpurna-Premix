import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { X, Lock, Lightbulb } from 'lucide-react';
import './CartPage.css';

export default function CartPage({ cart }) {
  const { cartItems, updateQuantity, removeFromCart, subtotal } = cart;
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [discount] = useState(0); // Static for now as requested
  const shipping = cartItems.length > 0 ? 40 : 0; // Standard shipping example
  const total = subtotal + shipping - discount;

  const handleApplyCoupon = () => {
    // UI only, logic to be added later
    if (coupon.trim()) {
      alert(`Coupon ${coupon} applied! (Simulation)`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page-empty">
        <div className="cart-empty-content">
          <h1 className="cart-page-title">Your Cart</h1>
          <p className="cart-empty-msg">Your cart is empty.</p>
          <Link to="/shop" className="cart-continue-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="cart-page-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="cart-page-header">
        <h1 className="cart-page-title">Your Cart</h1>
      </div>

      <div className="cart-layout">
        {/* Left Column: Items */}
        <div className="cart-left">
          <div className="cart-items-list">
            {cartItems.map(item => (
              <motion.div key={item.id} variants={itemVariants} className="cart-item-card">
                <button 
                  className="cart-item-remove" 
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove item"
                >
                  <X size={16} />
                </button>

                <div className="cart-item-image-wrap">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                </div>

                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  {/* Fake short info if not available, otherwise use real */}
                  <p className="cart-item-info">
                    {item.info || 'Serves 4 • Ready in 15 mins'}
                  </p>
                  
                  <div className="cart-item-controls-price">
                    <div className="cart-qty-selector">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="qty-btn"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="qty-btn"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-item-price">
                      {item.currency || '₹'}{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="cart-maas-tip">
            <div className="tip-header">
              <Lightbulb size={16} className="tip-icon" />
              <span className="tip-title">MAA'S TIP</span>
            </div>
            <p className="tip-text">
              Add a dollop of fresh ghee on the Dal Makhani right before serving for that authentic dhaba flavor!
            </p>
          </motion.div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="cart-right">
          <motion.div variants={itemVariants} className="order-summary-card">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Shipping (Standard)</span>
              <span className="summary-value">₹{shipping.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row discount-row">
              <span className="summary-label">Discount</span>
              <span className="summary-value">-₹{discount.toLocaleString('en-IN')}</span>
            </div>

            <div className="summary-total-row">
              <div className="total-label-stack">
                <span className="total-label">Total</span>
                <span className="total-tax-note">Inclusive of all taxes</span>
              </div>
              <span className="total-value">₹{total.toLocaleString('en-IN')}</span>
            </div>

            <div className="coupon-section">
              <input 
                type="text" 
                placeholder="Coupon code" 
                className="coupon-input"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button className="coupon-apply-btn" onClick={handleApplyCoupon}>Apply</button>
            </div>

            <button 
              className="checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout →
            </button>
            
            <div className="secure-checkout-note">
              <Lock size={12} /> Secure Checkout
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
