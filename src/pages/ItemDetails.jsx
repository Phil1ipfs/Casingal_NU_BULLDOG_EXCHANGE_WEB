import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import uniforms from '../data/uniform'; 
import schoolMerch from '../data/schoolMerch';
import { useCart } from '../context/CartContext';

const ItemDetails = () => {
  const { sectionId, itemId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const items = sectionId === 'uniforms' ? uniforms : schoolMerch;
  const item = items.find((i) => i.id === itemId);

  const [qty, setQty] = useState(1);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [itemId]); // Reset view when item changes

  if (!item) return <p>Item not found</p>;

  const handleAddToCart = () => {
    addToCart(item.id, qty);
    alert(`${qty} x ${item.name} added to cart.`);
  };

  const handleBuyNow = () => {
    addToCart(item.id, qty);
    navigate('/cart');
  };

  const categoryLabel = sectionId === 'uniforms' ? 'Uniform' : 'School Merchandise';
  const badgeClass = sectionId === 'uniforms' ? 'uniform-badge' : 'merch-badge';

  return (
    <div className="page-container">
      <div className="item-details-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        
        <div className="item-details-card">
          <div className="item-image-container">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="item-detail-image"
            />
            <div className="item-badges">
              <span className="item-badge">National U</span>
              <span className={`item-badge ${badgeClass}`}>{categoryLabel}</span>
            </div>
          </div>
          
          <div className="item-info">
            <h1>{item.name}</h1>
            <p className="price">₱{item.price.toFixed(2)}</p>
            <p className="description">{item.description}</p>
            
            <div className="item-meta">
              <span className="item-id">Product ID: {item.id}</span>
              <span className="item-category">Category: {categoryLabel}</span>
            </div>
            
            <div className="quantity-control">
              <label>Quantity:</label>
              <div className="quantity-buttons">
                <button 
                  className="qty-btn" 
                  onClick={() => qty > 1 && setQty(qty - 1)}
                  disabled={qty <= 1}
                >
                  -
                </button>
                <span className="qty-value">{qty}</span>
                <button 
                  className="qty-btn" 
                  onClick={() => setQty(qty + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="item-actions">
              <button className="add-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="buy-now-btn" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
            
            <div className="item-shipping">
              <p><strong>Shipping:</strong> Available for pickup at NU Main Campus</p>
              <p><strong>Returns:</strong> 7-day return policy for unworn items</p>
            </div>
          </div>
        </div>
        
        {/* Related items section */}
        <div className="related-items">
          <h2>You may also like</h2>
          <div className="related-items-grid">
            {items
              .filter(i => i.id !== item.id)
              .slice(0, 3)
              .map(relatedItem => (
                <div 
                  key={relatedItem.id} 
                  className="related-item"
                  onClick={() => navigate(`/item/${sectionId}/${relatedItem.id}`)}
                >
                  <img src={relatedItem.imageUrl} alt={relatedItem.name} />
                  <div className="related-item-info">
                    <h3>{relatedItem.name}</h3>
                    <p>₱{relatedItem.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;