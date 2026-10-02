import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaWallet,
  FaBoxOpen,
  FaTruck,
  FaUndo,
  FaEnvelope,
  FaIdCard,
  FaGraduationCap,
  FaCalendarAlt,
  FaHeart,
  FaSignOutAlt,
  FaPen,
  FaClipboardList,
} from 'react-icons/fa';
import uniforms from '../data/uniform';
import schoolMerch from '../data/schoolMerch';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';
import ProductImage from '../components/ProductImage';
import { formatPrice } from '../data/catalog';

const STATUS_KEYS = ['toPay', 'toShip', 'toReceived', 'toReturn'];
const STATUS_LABELS = {
  toPay: 'To Pay',
  toShip: 'To Ship',
  toReceived: 'To Receive',
  toReturn: 'To Return',
};
const STATUS_ICONS = {
  toPay: FaWallet,
  toShip: FaBoxOpen,
  toReceived: FaTruck,
  toReturn: FaUndo,
};

const getInitials = (name = '') =>
  name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'NU';

function Profile() {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { showToast } = useToast();
  const [selected, setSelected] = useState('toPay');

  // Get user details from localStorage
  const [user, setUser] = useState({
    name: 'Guest User',
    email: 'guest@example.com',
    joined: 'January 12, 2023'
  });

  // Order state - initialize from localStorage
  const [orders, setOrders] = useState({
    toPay: [],
    toShip: [],
    toReceived: [],
    toReturn: []
  });

  // Load user data on component mount
  useEffect(() => {
    // Combine all products for item lookup
    const allProducts = [...uniforms, ...schoolMerch];

    const savedUser = localStorage.getItem('nuUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load items from localStorage
    const toPayItems = JSON.parse(localStorage.getItem('nuToPayItems') || '[]');
    const toShipItems = JSON.parse(localStorage.getItem('nuToShipItems') || '[]');
    const toReceivedItems = JSON.parse(localStorage.getItem('nuToReceivedItems') || '[]');

    // Convert cart items to order items with details
    const processItems = (items) => {
      return items.map(item => {
        const product = allProducts.find(p => p.id === item.id);
        if (!product) return null;
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: item.quantity || 1
        };
      }).filter(Boolean);
    };

    // Set some default items if nothing in localStorage
    const defaultToPay = toPayItems.length === 0 ? [
      { id: 'u1', quantity: 1 },
      { id: 'u4', quantity: 1 }
    ] : toPayItems;

    const defaultToShip = toShipItems.length === 0 ? [
      { id: 'm2', quantity: 1 }
    ] : toShipItems;

    const defaultToReceived = toReceivedItems.length === 0 ? [
      { id: 'm5', quantity: 1 },
      { id: 'm3', quantity: 2 }
    ] : toReceivedItems;

    setOrders({
      toPay: processItems(defaultToPay),
      toShip: processItems(defaultToShip),
      toReceived: processItems(defaultToReceived),
      toReturn: [] // Keep to-return empty as per requirements
    });
  }, []);

  const handleViewDetails = (item) => {
    // Extract section from item id (u = uniforms, m = schoolMerch)
    const section = item.id.startsWith('u') ? 'uniforms' : 'school-merch';
    navigate(`/item/${section}/${item.id}`);
  };

  const handleAction = (item, fromStatus, toStatus) => {
    // Move item from one status to another
    setOrders(prev => {
      const fromItems = [...prev[fromStatus]];
      const toItems = [...prev[toStatus]];

      // Remove from source
      const updatedFromItems = fromItems.filter(i => i.id !== item.id);

      // Add to destination
      toItems.push(item);

      return {
        ...prev,
        [fromStatus]: updatedFromItems,
        [toStatus]: toItems
      };
    });
  };

  const getActionButton = (item) => {
    switch(selected) {
      case 'toPay':
        return (
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => handleAction(item, 'toPay', 'toShip')}
          >
            Pay Now
          </button>
        );
      case 'toShip':
        return <span className="status-pill">Awaiting shipment</span>; // No action needed (waiting for admin)
      case 'toReceived':
        return (
          <button
            type="button"
            className="btn btn--success btn--sm"
            onClick={() => handleAction(item, 'toReceived', 'toReturn')}
          >
            Confirm Receipt
          </button>
        );
      case 'toReturn':
        return (
          <button
            type="button"
            className="btn btn--outline-danger btn--sm"
            onClick={() => showToast(`Return process initiated for ${item.name}`, 'info')}
          >
            Return
          </button>
        );
      default:
        return null;
    }
  };

  const items = orders[selected] || [];

  return (
    <div className="container page profile">
      <section className="profile-hero">
        <div className="profile-hero__cover" aria-hidden="true" />
        <div className="profile-hero__body">
          <span className="avatar avatar--xl" aria-hidden="true">{getInitials(user.name)}</span>
          <div className="profile-hero__info">
            <h1 className="profile-hero__name">{user.name}</h1>
            <ul className="profile-hero__meta">
              <li><FaEnvelope aria-hidden="true" /> {user.email}</li>
              {user.studentId && <li><FaIdCard aria-hidden="true" /> Student ID: {user.studentId}</li>}
              {user.course && <li><FaGraduationCap aria-hidden="true" /> Program: {user.course}</li>}
              <li><FaCalendarAlt aria-hidden="true" /> Member since {user.joined}</li>
            </ul>
          </div>
          <div className="profile-hero__actions">
            <button type="button" className="btn btn--outline btn--sm" disabled title="Profile editing is not available yet">
              <FaPen aria-hidden="true" /> Edit Profile
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => {
                localStorage.removeItem('nuUser');
                navigate('/login');
              }}
            >
              <FaSignOutAlt aria-hidden="true" /> Logout
            </button>
          </div>
        </div>
      </section>

      <div className="stat-grid" role="tablist" aria-label="Order status">
        {STATUS_KEYS.map(key => {
          const Icon = STATUS_ICONS[key];
          return (
            <button
              type="button"
              key={key}
              role="tab"
              id={`tab-${key}`}
              aria-selected={selected === key}
              aria-controls="orders-panel"
              className={`stat-card ${selected === key ? 'is-active' : ''}`}
              onClick={() => setSelected(key)}
            >
              <span className="stat-card__icon"><Icon aria-hidden="true" /></span>
              <span className="stat-card__value">{orders[key]?.length || 0}</span>
              <span className="stat-card__label">{STATUS_LABELS[key]}</span>
            </button>
          );
        })}
        <Link to="/wishlist" className="stat-card stat-card--link">
          <span className="stat-card__icon"><FaHeart aria-hidden="true" /></span>
          <span className="stat-card__value">{favorites.length}</span>
          <span className="stat-card__label">Saved</span>
        </Link>
      </div>

      <section className="panel orders" id="orders-panel" role="tabpanel" aria-labelledby={`tab-${selected}`}>
        <h2 className="panel__title">{STATUS_LABELS[selected]}</h2>

        {items.length > 0 ? (
          <ul className="order-list">
            {items.map(item => (
              <li key={item.id} className="order-row">
                <ProductImage src={item.imageUrl} alt={item.name} className="order-row__img" />
                <div className="order-row__details">
                  <span className="order-row__name">{item.name}</span>
                  <span className="order-row__price">{formatPrice(item.price)}</span>
                  {item.quantity > 1 && (
                    <span className="order-row__qty">Qty: {item.quantity}</span>
                  )}
                </div>
                <div className="order-row__actions">
                  {getActionButton(item)}
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => handleViewDetails(item)}
                  >
                    View
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state empty-state--compact">
            <FaClipboardList className="empty-state__icon" aria-hidden="true" />
            <p>You have no items {STATUS_LABELS[selected].toLowerCase()}.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Profile;
