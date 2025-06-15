// src/pages/Cart.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const CartItem = ({ item, updateQuantity, removeItem }) => {
  return (
    <div className="cart-item">
      <h3 className="cart-item-name">{item.name}</h3>
      
      <div className="cart-item-details">
        <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
        
        <div className="cart-item-info">
          <p className="cart-item-price">₱{item.price.toFixed(2)}</p>
          
          <div className="quantity-controls">
            <button 
              className="quantity-btn"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <FaMinus size={12} />
            </button>
            
            <span className="quantity-value">{item.quantity}</span>
            
            <button 
              className="quantity-btn"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <FaPlus size={12} />
            </button>
          </div>
        </div>
      </div>
      
      <button 
        className="remove-btn"
        onClick={() => removeItem(item.id)}
      >
        Remove
      </button>
    </div>
  );
};

const Cart = () => {
  const navigate = useNavigate();
  const { 
    getCartWithDetails, 
    updateQuantity, 
    removeFromCart, 
    cartTotal, 
    checkout 
  } = useCart();
  
  // Get cart items with full details
  const cartItems = getCartWithDetails();

  const handleCheckout = () => {
    checkout();
    alert('Order placed successfully!');
    navigate('/profile');
  };

  return (
    <div className="page-container">
      <h1 className="cart-heading">Your Cart</h1>

      <div className="cart-content">
        {cartItems.length > 0 ? (
          <>
            <div className="cart-items-container">
              {cartItems.map(item => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  updateQuantity={updateQuantity}
                  removeItem={removeFromCart}
                />
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="cart-total">
                <span className="total-label">Total:</span>
                <span className="total-amount">₱{cartTotal.toFixed(2)}</span>
              </div>
              
              <button 
                className="checkout-button"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button 
              className="continue-shopping-btn"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;