import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/nubdexchange_logo.png';
import { STORE } from '../data/catalog';

const Footer = () => (
  <footer className="site-footer">
    <div className="container site-footer__inner">
      <div className="site-footer__brand">
        <Link to="/" className="brand brand--light">
          <img src={logo} alt="" className="brand__logo" />
          <span className="brand__text">
            <strong>NU Bulldog</strong>
            <span>Exchange</span>
          </span>
        </Link>
        <p>Buy, sell and exchange within the Bulldog community. Official National University uniforms and merchandise.</p>
      </div>

      <nav className="site-footer__col" aria-label="Shop">
        <h2>Shop</h2>
        <Link to="/browse">All products</Link>
        <Link to="/section/uniforms">Uniforms</Link>
        <Link to="/section/school-merch">Merchandise</Link>
      </nav>

      <nav className="site-footer__col" aria-label="Account">
        <h2>Account</h2>
        <Link to="/profile">My profile &amp; orders</Link>
        <Link to="/wishlist">Saved items</Link>
        <Link to="/cart">Cart</Link>
      </nav>

      <div className="site-footer__col">
        <h2>Pickup</h2>
        <p>{STORE.pickup}</p>
        <p>{STORE.returns}</p>
      </div>
    </div>
    <div className="container site-footer__bottom">
      <p>© {new Date().getFullYear()} NU Bulldog Exchange. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
