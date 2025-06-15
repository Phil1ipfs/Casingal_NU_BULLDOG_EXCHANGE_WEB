import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

const HeroBanner = ({
  image,
  title,
  subtitle,
  ctaText,
  ctaLink
}) => (
  <section
    className="hero-banner"
    style={{ backgroundImage: `url(${image})` }}
  >
    <div className="hero-overlay">
      <div className="hero-content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {ctaText && ctaLink && (
          <a href={ctaLink} className="hero-button">
            {ctaText} <FaArrowRight style={{ marginLeft: '8px' }} />
          </a>
        )}
      </div>
    </div>
  </section>
);

export default HeroBanner;