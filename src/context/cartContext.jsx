// src/context/CartContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import uniforms from '../data/uniform';
import schoolMerch from '../data/schoolMerch';

// Combine all products for cart lookup
const allProducts = [...uniforms, ...schoolMerch];

// Create context
export const CartContext = createContext();

// Create provider component
export const CartProvider = ({ children }) => {
  // State for cart items
  const [cartItems, setCartItems] = useState([]);
  // State for cart total
  const [cartTotal, setCartTotal] = useState(0);
  // State for cart count
  const [cartCount, setCartCount] = useState(0);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('nuCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Update localStorage and calculate total whenever cart changes
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('nuCart', JSON.stringify(cartItems));
    
    // Calculate total
    let total = 0;
    let count = 0;
    
    cartItems.forEach(item => {
      const product = allProducts.find(p => p.id === item.id);
      if (product) {
        total += product.price * item.quantity;
        count += item.quantity;
      }
    });
    
    setCartTotal(total);
    setCartCount(count);
  }, [cartItems]);

  // Add item to cart
  const addToCart = (productId, quantity = 1) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.id === productId);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, { id: productId, quantity }];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get full product details for cart items
  const getCartWithDetails = () => {
    return cartItems.map(item => {
      const product = allProducts.find(p => p.id === item.id);
      return {
        ...product,
        quantity: item.quantity
      };
    }).filter(Boolean); // Filter out any null items (in case product not found)
  };

  // Checkout process
  const checkout = () => {
    // Move items to "toPay" section
    localStorage.setItem('nuToPayItems', JSON.stringify(cartItems));
    // Clear cart
    clearCart();
    return true;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartWithDetails,
        checkout
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};