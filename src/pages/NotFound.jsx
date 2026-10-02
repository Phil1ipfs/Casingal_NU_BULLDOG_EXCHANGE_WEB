import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/nubdexchange_logo.png';

const NotFound = () => (
  <div className="container page">
    <div className="empty-state">
      <img src={logo} alt="" className="empty-state__logo" />
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist or isn't available yet.</p>
      <div className="empty-state__actions">
        <Link to="/" className="btn btn--primary">Back to Home</Link>
        <Link to="/browse" className="btn btn--outline">Browse products</Link>
      </div>
    </div>
  </div>
);

export default NotFound;
