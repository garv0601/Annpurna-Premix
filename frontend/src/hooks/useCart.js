import { useState, useEffect } from 'react';
import { onAuthStateChange } from '../services/auth';

export const useCart = () => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('aether_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aether_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Empty the cart whenever the user signs out without placing an order,
  // so the next login (or the next user on this device) starts fresh.
  useEffect(() => {
    const unsubscribe = onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setCartItems([]);
      }
    });
    return unsubscribe;
  }, []);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      const stock = product.stock_quantity ?? 0;

      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > stock) {
          alert(`Only ${stock} available`);
          return prev;
        }
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQty }
            : item
        );
      }
      
      if (quantity > stock) {
        alert(`Only ${stock} available`);
        return prev;
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => {
      const item = prev.find(i => i.id === productId);
      if (item && item.stock_quantity !== undefined && quantity > item.stock_quantity) {
        alert(`Only ${item.stock_quantity} available`);
        return prev;
      }
      return prev.map(i => (i.id === productId ? { ...i, quantity } : i));
    });
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal
  };
};
