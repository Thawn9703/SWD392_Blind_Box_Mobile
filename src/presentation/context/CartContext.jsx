// src/presentation/context/CartContext.jsx
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      title: "Dimoo Space Series - Package #8",
      image:
        "https://bizweb.dktcdn.net/100/329/122/files/blind-box-popmart-la-nhung-chiec-hop-kin-co-chua-nhan-vat-ngau-nhien.webp?v=1724125816533",
      quantity: 1,
      price: 480000,
      selected: false,
    },
    {
      id: "2",
      title: "Dimoo Space Series - Package #9",
      image: "https://example.com/product-image.jpg",
      quantity: 1,
      price: 1200000,
      selected: false,
    },
  ]); // Thêm initial state ở đây

  const cartItemCount = cartItems.length; // Thêm dòng này

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, cartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};