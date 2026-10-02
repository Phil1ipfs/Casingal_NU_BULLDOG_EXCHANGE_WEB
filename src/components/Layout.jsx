import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="layout-wrapper">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar />
      <main id="main-content" tabIndex="-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
};

export default Layout;
