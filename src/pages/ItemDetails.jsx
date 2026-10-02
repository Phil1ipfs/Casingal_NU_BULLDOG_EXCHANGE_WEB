import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FaArrowLeft,
  FaChevronRight,
  FaHeart,
  FaRegHeart,
  FaMinus,
  FaPlus,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaUndo,
  FaStore,
  FaShoppingCart,
  FaBolt,
} from 'react-icons/fa';
import uniforms from '../data/uniform';
import schoolMerch from '../data/schoolMerch';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';
import ProductImage from '../components/ProductImage';
import ItemCard from '../components/ItemCard';
import { formatPrice, isLimitedStock, STORE } from '../data/catalog';
import logo from '../assets/nubdexchange_logo.png';

const ItemDetails = () => {
  const { sectionId, itemId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();

  const items = sectionId === 'uniforms' ? uniforms : schoolMerch;
  const item = items.find((i) => i.id === itemId);

  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });

  // Reset quantity when navigating between items
  const [prevItemId, setPrevItemId] = useState(itemId);
  if (prevItemId !== itemId) {
    setPrevItemId(itemId);
    setQty(1);
  }

  if (!item) {
    return (
      <div className="container page">
        <div className="empty-state">
          <FaStore className="empty-state__icon" aria-hidden="true" />
          <h1>Item not found</h1>
          <p>This item may have been removed or the link is incorrect.</p>
          <Link to="/browse" className="btn btn--primary">Browse products</Link>
        </div>
      </div>
    );
  }

  const saved = isFavorite(item.id);

  const handleAddToCart = () => {
    addToCart(item.id, qty);
    showToast(`${qty} x ${item.name} added to cart.`);
  };

  const handleBuyNow = () => {
    addToCart(item.id, qty);
    navigate('/cart');
  };

  const handleToggleFavorite = () => {
    const nowSaved = toggleFavorite(item.id);
    showToast(nowSaved ? `${item.name} saved.` : `${item.name} removed from saved items.`, 'info');
  };

  const handleZoomMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({
      active: true,
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const categoryLabel = sectionId === 'uniforms' ? 'Uniform' : 'School Merchandise';
  const categoryLink = sectionId === 'uniforms' ? '/section/uniforms' : '/section/school-merch';
  const relatedItems = items.filter((i) => i.id !== item.id).slice(0, 3);

  return (
    <div className="container page item-page">
      <div className="item-page__top">
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => navigate(-1)}>
          <FaArrowLeft aria-hidden="true" /> Back
        </button>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FaChevronRight aria-hidden="true" />
          <Link to={categoryLink}>{categoryLabel}</Link>
          <FaChevronRight aria-hidden="true" />
          <span aria-current="page">{item.name}</span>
        </nav>
      </div>

      <div className="pdp">
        <div className="pdp__gallery">
          <div
            className={`pdp__media ${zoom.active ? 'is-zoomed' : ''}`}
            onMouseMove={handleZoomMove}
            onMouseLeave={() => setZoom((z) => ({ ...z, active: false }))}
            style={{ '--zoom-x': `${zoom.x}%`, '--zoom-y': `${zoom.y}%` }}
          >
            <ProductImage src={item.imageUrl} alt={item.name} />
            <div className="pdp__badges">
              <span className="badge badge--navy">National U</span>
              {isLimitedStock(item) && <span className="badge badge--gold">Limited stock</span>}
            </div>
            <button
              type="button"
              className={`fav-btn fav-btn--lg ${saved ? 'is-active' : ''}`}
              onClick={handleToggleFavorite}
              aria-pressed={saved}
              aria-label={saved ? `Remove ${item.name} from saved items` : `Save ${item.name}`}
            >
              {saved ? <FaHeart aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
            </button>
          </div>
        </div>

        <div className="pdp__info">
          <span className={`chip chip--${sectionId === 'uniforms' ? 'blue' : 'gold'}`}>{categoryLabel}</span>
          <h1 className="pdp__title">{item.name}</h1>
          <p className="pdp__price">{formatPrice(item.price)}</p>
          <p className="pdp__description">{item.description}</p>

          <dl className="pdp__meta">
            <div>
              <dt>Product ID</dt>
              <dd>{item.id}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{categoryLabel}</dd>
            </div>
            <div>
              <dt>Pickup</dt>
              <dd>{STORE.location}</dd>
            </div>
          </dl>

          <div className="pdp__qty">
            <span id="qty-label" className="pdp__qty-label">Quantity</span>
            <div className="stepper" role="group" aria-labelledby="qty-label">
              <button
                type="button"
                onClick={() => qty > 1 && setQty(qty - 1)}
                disabled={qty <= 1}
                aria-label="Decrease quantity"
              >
                <FaMinus aria-hidden="true" />
              </button>
              <span className="stepper__value" aria-live="polite">{qty}</span>
              <button type="button" onClick={() => setQty(qty + 1)} aria-label="Increase quantity">
                <FaPlus aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="pdp__actions">
            <button type="button" className="btn btn--outline btn--lg" onClick={handleAddToCart}>
              <FaShoppingCart aria-hidden="true" /> Add to Cart
            </button>
            <button type="button" className="btn btn--primary btn--lg" onClick={handleBuyNow}>
              <FaBolt aria-hidden="true" /> Buy Now
            </button>
          </div>

          <div className="seller-card">
            <img src={logo} alt="" className="seller-card__avatar" />
            <div className="seller-card__body">
              <span className="seller-card__label">Sold by</span>
              <strong className="seller-card__name">
                {STORE.name} <FaCheckCircle className="verified-icon" aria-label="Official store" />
              </strong>
              <span className="seller-card__meta">
                <FaMapMarkerAlt aria-hidden="true" /> {STORE.location}
              </span>
            </div>
          </div>

          <ul className="pdp__perks">
            <li><FaMapMarkerAlt aria-hidden="true" /> <span><strong>Shipping:</strong> {STORE.pickup}</span></li>
            <li><FaUndo aria-hidden="true" /> <span><strong>Returns:</strong> {STORE.returns}</span></li>
          </ul>
        </div>
      </div>

      <div className="pdp__details">
        <section className="panel">
          <h2 className="panel__title">Product Details</h2>
          <p>{item.description}</p>
          <table className="spec-table">
            <tbody>
              <tr><th scope="row">Product</th><td>{item.name}</td></tr>
              <tr><th scope="row">Category</th><td>{categoryLabel}</td></tr>
              <tr><th scope="row">Price</th><td>{formatPrice(item.price)}</td></tr>
              <tr><th scope="row">Product ID</th><td>{item.id}</td></tr>
            </tbody>
          </table>
        </section>
        <section className="panel">
          <h2 className="panel__title">Seller Information</h2>
          <div className="seller-card seller-card--flat">
            <img src={logo} alt="" className="seller-card__avatar" />
            <div className="seller-card__body">
              <strong className="seller-card__name">
                {STORE.name} <FaCheckCircle className="verified-icon" aria-label="Official store" />
              </strong>
              <span className="seller-card__meta">Official National University store</span>
            </div>
          </div>
          <ul className="pdp__perks">
            <li><FaMapMarkerAlt aria-hidden="true" /> <span>{STORE.pickup}</span></li>
            <li><FaUndo aria-hidden="true" /> <span>{STORE.returns}</span></li>
          </ul>
        </section>
      </div>

      {relatedItems.length > 0 && (
        <section className="related">
          <div className="section-head">
            <div>
              <h2 className="section-head__title">You may also like</h2>
              <p className="section-head__subtitle">More {categoryLabel.toLowerCase()} from {STORE.name}</p>
            </div>
            <Link to={categoryLink} className="link-arrow">View All <FaChevronRight aria-hidden="true" /></Link>
          </div>
          <div className="products-grid">
            {relatedItems.map((relatedItem) => (
              <ItemCard key={relatedItem.id} item={relatedItem} section={sectionId} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ItemDetails;
