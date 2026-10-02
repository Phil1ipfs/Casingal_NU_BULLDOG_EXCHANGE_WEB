import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaTimes,
  FaHistory,
  FaArrowRight,
  FaTshirt,
  FaShoppingBag,
  FaFire
} from 'react-icons/fa';
import { allProducts, formatPrice, getSectionForItem, matchesQuery } from '../data/catalog';
import ProductImage from './ProductImage';

// Popular search terms
const popularSearches = ['uniform', 'hoodie', 'nursing', 'lanyards', 'jacket'];

const loadRecentSearches = () => {
  try {
    return JSON.parse(localStorage.getItem('nuRecentSearches') || '[]').slice(0, 5);
  } catch {
    return [];
  }
};

/**
 * Live product search with suggestions.
 * - variant: "nav" (compact, header) | "hero" (large, homepage)
 * - category: optional section id ("uniforms" | "school-merch") to scope results
 */
const SearchBar = ({ variant = 'nav', category = 'all', autoFocus = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState(loadRecentSearches);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const scopedProducts = category === 'all'
    ? allProducts
    : allProducts.filter((p) => getSectionForItem(p) === category);

  const findResults = (term) => scopedProducts.filter((p) => matchesQuery(p, term)).slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(timerRef.current);
    };
  }, []);

  const saveRecentSearch = (term) => {
    const updatedSearches = [
      { term, timestamp: new Date().toISOString() },
      ...recentSearches.filter((s) => s.term !== term),
    ].slice(0, 5);
    setRecentSearches(updatedSearches);
    try {
      localStorage.setItem('nuRecentSearches', JSON.stringify(updatedSearches));
    } catch {
      // ignore storage errors
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    clearTimeout(timerRef.current);

    if (value.length > 1) {
      setLoading(true);
      // Short debounce for a smoother experience
      timerRef.current = setTimeout(() => {
        setSearchResults(findResults(value));
        setShowResults(true);
        setLoading(false);
      }, 200);
    } else {
      setLoading(false);
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  const handleProductClick = (product) => {
    saveRecentSearch(product.name);
    navigate(`/item/${getSectionForItem(product)}/${product.id}`);
    setSearchTerm('');
    setShowResults(false);
  };

  // Enter: go to the Browse page filtered by the search term (and category).
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    const base = category === 'all' ? '/browse' : `/section/${category}`;

    if (term.length > 0) saveRecentSearch(term);
    navigate(term ? `${base}?q=${encodeURIComponent(term)}` : base);
    setShowResults(false);
    inputRef.current?.blur();
  };

  const handleSuggestionClick = (term) => {
    setSearchTerm(term);
    setSearchResults(findResults(term));
    setShowResults(true);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setFocused(true);
    setShowResults(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowResults(false);
    } else if (e.key === 'ArrowDown' && showResults) {
      const first = searchRef.current?.querySelector('.search-dropdown button');
      if (first) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  // Arrow-key navigation between dropdown options.
  const handleDropdownKeyDown = (e) => {
    if (!['ArrowDown', 'ArrowUp', 'Escape'].includes(e.key)) return;
    e.preventDefault();
    if (e.key === 'Escape') {
      setShowResults(false);
      inputRef.current?.focus();
      return;
    }
    const options = [...searchRef.current.querySelectorAll('.search-dropdown button')];
    const index = options.indexOf(document.activeElement);
    const next = e.key === 'ArrowDown' ? index + 1 : index - 1;
    if (next < 0) inputRef.current?.focus();
    else options[Math.min(next, options.length - 1)]?.focus();
  };

  const hasTerm = searchTerm.length > 1;

  return (
    <div className={`search search--${variant}`} ref={searchRef}>
      <form onSubmit={handleSearchSubmit} role="search">
        <div className={`search__field ${focused ? 'is-focused' : ''}`}>
          <FaSearch className="search__icon" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            placeholder={variant === 'hero' ? 'Search for uniforms, hoodies, lanyards...' : 'Search products...'}
            aria-label="Search products"
            value={searchTerm}
            onChange={handleSearch}
            onFocus={handleFocus}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKeyDown}
            className="search__input"
            autoComplete="off"
            autoFocus={autoFocus}
          />
          {loading && <span className="search__spinner" aria-hidden="true" />}
          {searchTerm && (
            <button type="button" className="search__clear" onClick={clearSearch} aria-label="Clear search">
              <FaTimes aria-hidden="true" />
            </button>
          )}
          {variant === 'hero' && (
            <button type="submit" className="btn btn--gold search__submit">
              Search
            </button>
          )}
        </div>

        {showResults && (
          <div className="search-dropdown" onKeyDown={handleDropdownKeyDown}>
            {hasTerm && searchResults.length > 0 && (
              <>
                <div className="search-dropdown__header">Products</div>
                <div className="search-dropdown__list">
                  {searchResults.map((product) => {
                    const isUniform = getSectionForItem(product) === 'uniforms';
                    return (
                      <button
                        type="button"
                        key={product.id}
                        className="search-result"
                        onClick={() => handleProductClick(product)}
                      >
                        <ProductImage src={product.imageUrl} alt={product.name} className="search-result__img" />
                        <span className="search-result__details">
                          <span className="search-result__title">{product.name}</span>
                          <span className="search-result__meta">
                            <span className={`chip chip--${isUniform ? 'blue' : 'gold'}`}>
                              {isUniform ? <FaTshirt aria-hidden="true" /> : <FaShoppingBag aria-hidden="true" />}
                              {isUniform ? 'Uniform' : 'Merch'}
                            </span>
                            <span className="search-result__price">{formatPrice(product.price)}</span>
                          </span>
                        </span>
                        <FaArrowRight className="search-result__arrow" aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
                <button type="submit" className="search-dropdown__all">
                  See all results for “{searchTerm}” <FaArrowRight aria-hidden="true" />
                </button>
              </>
            )}

            {hasTerm && !loading && searchResults.length === 0 && (
              <div className="search-dropdown__empty">
                <p>No products found for “{searchTerm}”</p>
                <span>Try different keywords or browse categories</span>
              </div>
            )}

            {!hasTerm && recentSearches.length > 0 && (
              <>
                <div className="search-dropdown__header">Recent searches</div>
                <div className="search-dropdown__chips">
                  {recentSearches.map((search, index) => (
                    <button type="button" key={index} className="suggestion" onClick={() => handleSuggestionClick(search.term)}>
                      <FaHistory aria-hidden="true" /> {search.term}
                    </button>
                  ))}
                </div>
              </>
            )}

            {!hasTerm && (
              <>
                <div className="search-dropdown__header">Popular searches</div>
                <div className="search-dropdown__chips">
                  {popularSearches.map((term) => (
                    <button type="button" key={term} className="suggestion" onClick={() => handleSuggestionClick(term)}>
                      <FaFire className="suggestion__hot" aria-hidden="true" /> {term}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="search-dropdown__footer">Press Enter to search</div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
