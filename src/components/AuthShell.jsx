import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/nubdexchange_logo.png';
import bgImage from '../assets/nu-bg.jpg';

// Split-screen layout shared by the Login and Signup pages.
const AuthShell = ({ heading, message, features = [], children }) => (
  <div className="auth">
    <aside className="auth__brand" style={{ '--auth-bg': `url(${bgImage})` }}>
      <div className="auth__brand-inner">
        <Link to="/" className="brand brand--light">
          <img src={logo} alt="" className="brand__logo" />
          <span className="brand__text">
            <strong>NU Bulldog</strong>
            <span>Exchange</span>
          </span>
        </Link>
        <div className="auth__brand-copy">
          <h2>{heading}</h2>
          <p>{message}</p>
          {features.length > 0 && (
            <ul className="auth__features">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <li key={feature.text}>
                    <span className="auth__feature-icon"><Icon aria-hidden="true" /></span>
                    {feature.text}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <p className="auth__brand-foot">Buy, sell and exchange within the Bulldog community.</p>
      </div>
    </aside>

    <div className="auth__panel">
      <div className="auth-card">{children}</div>
    </div>
  </div>
);

export default AuthShell;
