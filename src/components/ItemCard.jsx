import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const ItemCard = ({ item, section }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    addToCart(item.id, 1);
    alert(`${item.name} added to cart.`);
  };

  const handleItemClick = () => {
    navigate(`/item/${section}/${item.id}`);
  };

  // Calculate discount badge (for demonstration)
  const showBadge = item.id.includes('3') || item.id.includes('6');

  return (
    <div className="product-card" onClick={handleItemClick}>
      {/* Diagonal ribbon badge */}
      <div className="product-badge">BULLDOGS EXCHANGE</div>
      
      {/* Product image */}
      <div className="product-image-container">
        <img src={item.imageUrl} alt={item.name} className="product-image" />
        <div className="nu-badge"></div>
        
        {/* Quick action buttons that appear on hover */}
        <div className="product-actions">
          <button 
            className="quick-view-btn" 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/item/${section}/${item.id}`);
            }}
            title="Quick view"
          >
            <FaEye />
          </button>
          <button 
            className="quick-cart-btn" 
            onClick={handleAddToCart}
            title="Add to cart"
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
      
      {/* Product info */}
      <div className="product-info">
        <h3 className="product-title">{item.name}</h3>
        <div className="product-divider"></div>
        
        {showBadge && (
          <div className="product-price-container">
            <span className="product-price">₱{item.price.toFixed(2)}</span>
            <span className="product-discount">LIMITED STOCK</span>
          </div>
        )}
        
        {!showBadge && (
          <p className="product-price">₱{item.price.toFixed(2)}</p>
        )}
        
        <button className="product-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ItemCard;