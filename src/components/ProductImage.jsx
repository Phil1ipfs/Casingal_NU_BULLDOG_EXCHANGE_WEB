import React, { useState } from 'react';
import logo from '../assets/nubdexchange_logo.png';

// Product image with a loading shimmer and a branded fallback when the
// source fails to load (e.g. expired remote image links).
const ProductImage = ({ src, alt, className = '' }) => {
  const [loadedSrc, setLoadedSrc] = useState(null);
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) {
    return (
      <div className={`product-img product-img--fallback ${className}`} role="img" aria-label={alt}>
        <img src={logo} alt="" aria-hidden="true" />
        <span aria-hidden="true">{alt}</span>
      </div>
    );
  }

  return (
    <div className={`product-img ${loadedSrc === src ? 'is-loaded' : 'is-loading'} ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoadedSrc(src)}
        onError={() => setFailedSrc(src)}
      />
    </div>
  );
};

export default ProductImage;
