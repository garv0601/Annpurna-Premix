import React from 'react';
import Navbar from '../navbar/Navbar';

// Header is a thin wrapper around Navbar, preserving the layout architecture
export default function Header({ cartCount, onOpenCart }) {
  return <Navbar cartCount={cartCount} onOpenCart={onOpenCart} />;
}
