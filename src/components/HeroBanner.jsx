import React, { useState } from 'react';
import { FaCheckCircle, FaMapMarkerAlt, FaUndo } from 'react-icons/fa';
import SearchBar from './SearchBar';
import { CATEGORIES, allProducts, STORE } from '../data/catalog';

const HeroBanner = ({ image, eyebrow, title, highlight, subtitle }) => {
  const [category, setCategory] = useState('all');

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__inner">
        <div className="hero__copy">
          <span className="hero__eyebrow">{eyebrow}</span>
          <h1 id="hero-title" className="hero__title">
            {title}
            <span>{highlight}</span>
          </h1>
          <p className="hero__subtitle">{subtitle}</p>

          <div className="hero__search">
            <SearchBar variant="hero" category={category} />
            <div className="hero__filters">
              <label className="select-pill">
                <span className="sr-only">Category</span>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </label>
              <span className="hero__filter-note">
                <FaMapMarkerAlt aria-hidden="true" /> {STORE.location}
              </span>
            </div>
          </div>

          <ul className="hero__stats">
            <li><FaCheckCircle aria-hidden="true" /> {allProducts.length} official items</li>
            <li><FaMapMarkerAlt aria-hidden="true" /> Campus pickup</li>
            <li><FaUndo aria-hidden="true" /> 7-day returns</li>
          </ul>
        </div>

        <div className="hero__visual">
          <img src={image} alt="NU Bulldog mascot — official National U merchandise store" />
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
