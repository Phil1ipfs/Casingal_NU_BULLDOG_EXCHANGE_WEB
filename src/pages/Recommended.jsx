import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaTshirt, FaShoppingBag, FaThLarge, FaCheckCircle, FaMapMarkerAlt, FaUndo } from 'react-icons/fa';
import uniforms from '../data/uniform';
import schoolMerch from '../data/schoolMerch';
import HeroBanner from '../components/HeroBanner';
import ItemCard from '../components/ItemCard';
import bannerImg from '../assets/nu_bulldogex_banner.jpg';
import { allProducts, getSectionForItem, STORE } from '../data/catalog';

const SectionTitle = ({ title, subtitle, linkTo, linkLabel = 'View All' }) => (
  <div className="section-head">
    <div>
      <h2 className="section-head__title">{title}</h2>
      {subtitle && <p className="section-head__subtitle">{subtitle}</p>}
    </div>
    {linkTo && (
      <Link to={linkTo} className="link-arrow">
        {linkLabel} <FaArrowRight aria-hidden="true" />
      </Link>
    )}
  </div>
);

const CATEGORY_TILES = [
  {
    to: '/browse',
    label: 'All Products',
    description: 'Everything in the Bulldog Exchange',
    count: allProducts.length,
    icon: FaThLarge,
  },
  {
    to: '/section/uniforms',
    label: 'Uniforms',
    description: 'Official uniforms for every program',
    count: uniforms.length,
    icon: FaTshirt,
  },
  {
    to: '/section/school-merch',
    label: 'Merchandise',
    description: 'Hoodies, lanyards, bag tags & more',
    count: schoolMerch.length,
    icon: FaShoppingBag,
  },
];

const Recommended = () => {
  // Get items from each category
  const recommendedUniforms = uniforms.slice(0, 3);
  const recommendedMerch = schoolMerch.slice(0, 3);

  // Popular picks (same selection as before)
  const mixedItems = [
    ...uniforms.slice(3, 4),
    ...schoolMerch.slice(3, 5),
  ];

  return (
    <div className="home">
      <HeroBanner
        image={bannerImg}
        eyebrow="NU Bulldog Exchange"
        title="Buy. Sell. Exchange."
        highlight="Within the Bulldog community."
        subtitle="Your one-stop shop for official National University uniforms and merchandise."
      />

      <div className="container home__sections">
        <section>
          <SectionTitle title="Shop by Category" subtitle="Find exactly what you need for campus life" />
          <div className="category-tiles">
            {CATEGORY_TILES.map((tile) => {
              const Icon = tile.icon;
              return (
                <Link key={tile.to} to={tile.to} className="category-tile">
                  <span className="category-tile__icon"><Icon aria-hidden="true" /></span>
                  <span className="category-tile__text">
                    <strong>{tile.label}</strong>
                    <span>{tile.description}</span>
                  </span>
                  <span className="category-tile__count">{tile.count} items</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section>
          <SectionTitle
            title="Featured Listings"
            subtitle="Official NU uniforms and Bulldog merchandise picked for you"
            linkTo="/browse"
          />
          <div className="products-grid">
            {recommendedUniforms.map(item => (
              <ItemCard key={item.id} item={item} section="uniforms" />
            ))}
            {recommendedMerch.map(item => (
              <ItemCard key={item.id} item={item} section="school-merch" />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle
            title="Popular Items"
            subtitle="The most sought-after items by fellow NU students"
            linkTo="/browse"
          />
          <div className="products-grid">
            {mixedItems.map(item => (
              <ItemCard key={item.id} item={item} section={getSectionForItem(item)} />
            ))}
          </div>
        </section>

        <section className="trust-strip" aria-label="Why shop here">
          <div className="trust-item">
            <FaCheckCircle aria-hidden="true" />
            <div>
              <strong>Official NU items</strong>
              <span>Uniforms and merchandise for National University students</span>
            </div>
          </div>
          <div className="trust-item">
            <FaMapMarkerAlt aria-hidden="true" />
            <div>
              <strong>Campus pickup</strong>
              <span>{STORE.pickup}</span>
            </div>
          </div>
          <div className="trust-item">
            <FaUndo aria-hidden="true" />
            <div>
              <strong>Easy returns</strong>
              <span>{STORE.returns}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Recommended;
