import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegHeart } from 'react-icons/fa';
import ItemCard from '../components/ItemCard';
import { useFavorites } from '../context/FavoritesContext';
import { allProducts, getSectionForItem } from '../data/catalog';

const Wishlist = () => {
  const { favorites } = useFavorites();
  const savedItems = allProducts.filter((p) => favorites.includes(p.id));

  return (
    <div className="container page">
      <div className="page-title-row">
        <h1 className="page-title">Saved Items</h1>
        {savedItems.length > 0 && (
          <span className="page-title-row__meta">{savedItems.length} {savedItems.length === 1 ? 'item' : 'items'}</span>
        )}
      </div>

      {savedItems.length > 0 ? (
        <div className="products-grid">
          {savedItems.map((item) => (
            <ItemCard key={item.id} item={item} section={getSectionForItem(item)} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FaRegHeart className="empty-state__icon" aria-hidden="true" />
          <h2>No saved items yet</h2>
          <p>Tap the heart on any product to save it for later.</p>
          <Link to="/browse" className="btn btn--primary">Browse products</Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
