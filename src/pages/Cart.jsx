// src/pages/Cart.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaMinus, FaTrashAlt, FaShoppingCart, FaMapMarkerAlt, FaLock } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductImage from '../components/ProductImage';
import { formatPrice, getCategory, getItemPath, getSectionForItem, STORE } from '../data/catalog';

const CartItem = ({ item, updateQuantity, removeItem }) => {
  return (
    <li className="cart-item">
      <Link to={getItemPath(item)} className="cart-item__media" tabIndex="-1" aria-hidden="true">
        <ProductImage src={item.imageUrl} alt={item.name} />
      </Link>

      <div className="cart-item__info">
        <span className="cart-item__category">{getCategory(getSectionForItem(item)).singular}</span>
        <h3 className="cart-item__name">
          <Link to={getItemPath(item)}>{item.name}</Link>
        </h3>
        <span className="cart-item__unit">{formatPrice(item.price)} each</span>
      </div>

      <div className="cart-item__controls">
        <div className="stepper stepper--sm" role="group" aria-label={`Quantity for ${item.name}`}>
          <button
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            <FaMinus aria-hidden="true" />
          </button>
          <span className="stepper__value">{item.quantity}</span>
          <button
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            aria-label="Increase quantity"
          >
            <FaPlus aria-hidden="true" />
          </button>
        </div>
        <span className="cart-item__total">{formatPrice(item.price * item.quantity)}</span>
        <button
          type="button"
          className="icon-btn icon-btn--danger"
          onClick={() => removeItem(item.id)}
          aria-label={`Remove ${item.name} from cart`}
          title="Remove"
        >
          <FaTrashAlt aria-hidden="true" />
        </button>
      </div>
    </li>
  );
};

const Cart = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    getCartWithDetails,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
    checkout
  } = useCart();

  // Get cart items with full details
  const cartItems = getCartWithDetails();

  const handleCheckout = () => {
    checkout();
    showToast('Order placed successfully!');
    navigate('/profile');
  };

  return (
    <div className="container page">
      <div className="page-title-row">
        <h1 className="page-title">Your Cart</h1>
        {cartItems.length > 0 && <span className="page-title-row__meta">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>}
      </div>

      {cartItems.length > 0 ? (
        <div className="cart-layout">
          <ul className="cart-list">
            {cartItems.map(item => (
              <CartItem
                key={item.id}
                item={item}
                updateQuantity={updateQuantity}
                removeItem={removeFromCart}
              />
            ))}
          </ul>

          <aside className="cart-summary" aria-label="Order summary">
            <h2 className="cart-summary__title">Order Summary</h2>
            <dl className="cart-summary__rows">
              <div>
                <dt>Items ({cartCount})</dt>
                <dd>{formatPrice(cartTotal)}</dd>
              </div>
              <div>
                <dt>Pickup</dt>
                <dd>{STORE.location}</dd>
              </div>
            </dl>
            <div className="cart-summary__total">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <button type="button" className="btn btn--primary btn--lg btn--block" onClick={handleCheckout}>
              <FaLock aria-hidden="true" /> Checkout
            </button>
            <Link to="/" className="btn btn--ghost btn--block">Continue Shopping</Link>
            <p className="cart-summary__note">
              <FaMapMarkerAlt aria-hidden="true" /> {STORE.pickup}
            </p>
          </aside>
        </div>
      ) : (
        <div className="empty-state">
          <FaShoppingCart className="empty-state__icon" aria-hidden="true" />
          <h2>Your cart is empty</h2>
          <p>Browse official NU uniforms and merchandise to get started.</p>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
