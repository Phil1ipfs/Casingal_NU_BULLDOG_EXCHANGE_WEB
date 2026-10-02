import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaCartPlus, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';
import { formatPrice, getCategory, isLimitedStock, STORE } from '../data/catalog';
import ProductImage from './ProductImage';
import logo from '../assets/nubdexchange_logo.png';

const ItemCard = ({ item, section }) => {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();

  const saved = isFavorite(item.id);
  const category = getCategory(section);
  const itemPath = `/item/${section}/${item.id}`;

  const handleAddToCart = () => {
    addToCart(item.id, 1);
    showToast(`${item.name} added to cart.`);
  };

  const handleToggleFavorite = () => {
    const nowSaved = toggleFavorite(item.id);
    showToast(nowSaved ? `${item.name} saved.` : `${item.name} removed from saved items.`, 'info');
  };

  return (
    <article className="product-card">
      <div className="product-card__media">
        <ProductImage src={item.imageUrl} alt={item.name} />
        {isLimitedStock(item) && <span className="badge badge--gold product-card__badge">Limited stock</span>}
        <button
          type="button"
          className={`fav-btn ${saved ? 'is-active' : ''}`}
          onClick={handleToggleFavorite}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${item.name} from saved items` : `Save ${item.name}`}
        >
          {saved ? <FaHeart aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
        </button>
      </div>

      <div className="product-card__body">
        <span className="product-card__category">{category.singular}</span>
        <h3 className="product-card__title">
          <Link to={itemPath} className="stretched-link">{item.name}</Link>
        </h3>

        <div className="product-card__price-row">
          <span className="product-card__price">{formatPrice(item.price)}</span>
          <button
            type="button"
            className="icon-btn icon-btn--primary"
            onClick={handleAddToCart}
            aria-label={`Add ${item.name} to cart`}
            title="Add to cart"
          >
            <FaCartPlus aria-hidden="true" />
          </button>
        </div>

        <div className="seller-row">
          <img src={logo} alt="" className="seller-row__avatar" />
          <div className="seller-row__text">
            <span className="seller-row__name">
              {STORE.name}
              <FaCheckCircle className="verified-icon" aria-label="Official store" />
            </span>
            <span className="seller-row__meta">
              <FaMapMarkerAlt aria-hidden="true" /> {STORE.location}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ItemCard;
