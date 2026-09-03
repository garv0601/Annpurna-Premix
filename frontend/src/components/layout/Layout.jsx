import React from 'react';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton/WhatsAppButton';
import CartDrawer from '../common/CartDrawer';

export const Layout = ({ children, cartProps, navbarProps }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        cartCount={navbarProps?.cartCount ?? 0}
        onOpenCart={navbarProps?.onOpenCart}
      />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
      <WhatsAppButton />
      <CartDrawer
        isOpen={cartProps?.isCartOpen}
        onClose={cartProps?.onCloseCart}
        cart={cartProps?.cart}
      />
    </div>
  );
};

export default Layout;
