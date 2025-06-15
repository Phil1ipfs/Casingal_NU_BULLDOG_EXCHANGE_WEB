import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/nubdexchange_logo.png';
import uniforms from '../data/uniform'; 
import schoolMerch from '../data/schoolMerch';

const STATUS_KEYS = ['toPay', 'toShip', 'toReceived', 'toReturn'];
const STATUS_LABELS = {
  toPay: 'To Pay',
  toShip: 'To Ship',
  toReceived: 'To Received',
  toReturn: 'To Return',
};

function Profile() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('toPay');
  
  // Get user details from localStorage
  const [user, setUser] = useState({
    name: 'Guest User',
    email: 'guest@example.com',
    joined: 'January 12, 2023'
  });
  
  // Combine all products for item lookup
  const allProducts = [...uniforms, ...schoolMerch];
  
  // Order state - initialize from localStorage
  const [orders, setOrders] = useState({
    toPay: [],
    toShip: [],
    toReceived: [],
    toReturn: []
  });

  // Load user data on component mount
  useEffect(() => {
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
            className="action-btn pay-btn"
            onClick={() => handleAction(item, 'toPay', 'toShip')}
          >
            Pay Now
          </button>
        );
      case 'toShip':
        return null; // No action needed (waiting for admin)
      case 'toReceived':
        return (
          <button
            className="action-btn confirm-btn"
            onClick={() => handleAction(item, 'toReceived', 'toReturn')}
          >
            Confirm Receipt
          </button>
        );
      case 'toReturn':
        return (
          <button
            className="action-btn return-btn"
            onClick={() => alert(`Return process initiated for ${item.name}`)}
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
    <div className="page-container">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-info">
            <img className="profile-logo" src={logo} alt="NU logo" />
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-joined">Member since {user.joined}</p>
            {user.studentId && <p className="profile-id">Student ID: {user.studentId}</p>}
            {user.course && <p className="profile-course">Program: {user.course}</p>}
          </div>
          
          <div className="profile-actions">
            <button className="edit-profile-btn">Edit Profile</button>
            <button 
              className="logout-btn" 
              onClick={() => {
                localStorage.removeItem('nuUser');
                navigate('/login');
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="orders-container">
          <div className="status-tabs">
            {STATUS_KEYS.map(key => (
              <div
                key={key}
                className={`status-tab ${selected === key ? 'active' : ''}`}
                onClick={() => setSelected(key)}
              >
                <span className="status-count">{orders[key]?.length || 0}</span>
                <span className="status-label">{STATUS_LABELS[key]}</span>
              </div>
            ))}
          </div>

          <div className="orders-content">
            <h2 className="orders-title">{STATUS_LABELS[selected]}</h2>

            {items.length > 0 ? (
              <ul className="order-items">
                {items.map(item => (
                  <li key={item.id} className="order-item">
                    <img src={item.imageUrl} alt={item.name} className="order-item-image" />
                    <div className="order-item-details">
                      <span className="order-item-name">{item.name}</span>
                      <span className="order-item-price">₱{item.price.toFixed(2)}</span>
                      {item.quantity > 1 && (
                        <span className="order-item-quantity">Qty: {item.quantity}</span>
                      )}
                    </div>
                    <div className="order-item-actions">
                      {getActionButton(item)}
                      <button
                        className="view-btn"
                        onClick={() => handleViewDetails(item)}
                      >
                        View
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-items">
                You have no items {STATUS_LABELS[selected].toLowerCase()}.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;