import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/Home/HomePage';
import ShopPage from './pages/Shop/ShopPage';
import ProductDetailPage from './pages/Product/ProductDetailPage';
import OurStoryPage from './pages/Story/OurStoryPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import OrderSuccessPage from './pages/Checkout/OrderSuccessPage';
import LoginPage from './pages/Auth/LoginPage';
import SignUpPage from './pages/Auth/SignUpPage';
import AccountPage from './pages/Account/AccountPage';
import EditProfile from './pages/Account/EditProfile';
import SavedAddresses from './pages/Account/SavedAddresses';
import PaymentMethods from './pages/Account/PaymentMethods';
import MyOrders from './pages/Orders/MyOrders';
import OrderDetails from './pages/Orders/OrderDetails';
import ContactPage from './pages/Contact/ContactPage';
import CartPage from './pages/Cart/CartPage';
import ProductDetailModal from './components/product/ProductDetailModal';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { useCart } from './hooks/useCart';

/**
 * ANNPURNA App root.
 * Cart persists via localStorage through authentication redirects.
 * Auth state is managed by AuthProvider / AuthContext.
 */

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const navigate = useNavigate();

  const cart = useCart();

  // Shared cart handler — adds to cart without opening drawer.
  // Guards against sold-out products: stock_quantity must be > 0.
  const handleAddToCartRaw = (product, qty = 1) => {
    // Safety check: do not add if product is out of stock
    const stock = product.stock_quantity ?? 0;
    if (stock <= 0) {
      console.warn('[Cart] Blocked add-to-cart: product is out of stock', product.name);
      return;
    }
    cart.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      currency: product.currency,
      stock_quantity: product.stock_quantity,
    }, qty);
  };

  // Shared quantity handler
  const handleUpdateQuantity = (productId, qty) => {
    cart.updateQuantity(productId, qty);
  };

  return (
    <AuthProvider>
      <Layout
        navbarProps={{
          cartCount: cart.totalItems,
          onOpenCart: () => navigate('/cart'),
        }}
        cartProps={{
          isCartOpen,
          onCloseCart: () => setIsCartOpen(false),
          cart,
        }}
      >
        <ScrollToTop />

        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                cartItems={cart.cartItems}
                onAddToCartRaw={handleAddToCartRaw}
                onUpdateQuantity={handleUpdateQuantity}
              />
            }
          />
          <Route
            path="/shop"
            element={
              <ShopPage
                cartItems={cart.cartItems}
                onAddToCartRaw={handleAddToCartRaw}
                onUpdateQuantity={handleUpdateQuantity}
              />
            }
          />
          <Route
            path="/product/:slug"
            element={
              <ProductDetailPage
                cartItems={cart.cartItems}
                onAddToCartRaw={handleAddToCartRaw}
                onUpdateQuantity={handleUpdateQuantity}
              />
            }
          />
          <Route path="/story" element={<OurStoryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage cart={cart} />} />

          {/* ── Auth routes ── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* ── Protected checkout ── */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage
                  cartItems={cart.cartItems}
                  subtotal={cart.subtotal}
                  updateQuantity={cart.updateQuantity}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success"
            element={
              <ProtectedRoute>
                <OrderSuccessPage />
              </ProtectedRoute>
            }
          />

          {/* ── Protected account ── */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <MyOrders onAddToCartRaw={handleAddToCartRaw} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <ProtectedRoute>
                <OrderDetails onAddToCartRaw={handleAddToCartRaw} />
              </ProtectedRoute>
            }
          />
          <Route path="/account/addresses" element={<ProtectedRoute><SavedAddresses /></ProtectedRoute>} />
          <Route path="/account/payment-methods" element={<ProtectedRoute><PaymentMethods /></ProtectedRoute>} />
        </Routes>

        {/* ProductDetailModal preserved for future use */}
        <ProductDetailModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={(product) => cart.addToCart(product)}
        />
      </Layout>
    </AuthProvider>
  );
}

export default App;
