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
import uniforms from '../data/uniform';
import schoolMerch from '../data/schoolMerch';

// Combine all products for search
const allProducts = [...uniforms, ...schoolMerch];

// Popular search terms
const popularSearches = ['uniform', 'hoodie', 'nursing', 'lanyards', 'jacket'];

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem('nuRecentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
    }
    
    // Add click outside listener to close results
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 1) {
      setLoading(true);
      
      // Simulate search delay for smoother experience
      setTimeout(() => {
        // Filter products based on search term
        const filteredResults = allProducts.filter(product => 
          product.name.toLowerCase().includes(value.toLowerCase()) ||
          product.description.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5); // Limit to 5 results
        
        setSearchResults(filteredResults);
        setShowResults(true);
        setLoading(false);
      }, 300);
    } else {
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowResults(false);
    inputRef.current.focus();
  };

  const handleProductClick = (product) => {
    // Determine section based on product ID
    const section = product.id.startsWith('u') ? 'uniforms' : 'school-merch';
    
    // Add to recent searches
    const newSearch = {
      term: product.name,
      timestamp: new Date().toISOString()
    };
    
    const updatedSearches = [newSearch, ...recentSearches.filter(s => s.term !== product.name)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('nuRecentSearches', JSON.stringify(updatedSearches));
    
    // Navigate to product
    navigate(`/item/${section}/${product.id}`);
    clearSearch();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    if (searchTerm.trim().length > 0) {
      // Add to recent searches
      const newSearch = {
        term: searchTerm,
        timestamp: new Date().toISOString()
      };
      
      const updatedSearches = [newSearch, ...recentSearches.filter(s => s.term !== searchTerm)].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('nuRecentSearches', JSON.stringify(updatedSearches));
      
      // Navigate to search results page or first result
      if (searchResults.length > 0) {
        handleProductClick(searchResults[0]);
      } else {
        // If we had a dedicated search results page, we would navigate there
        // For now, just alert the user
        alert(`Searching for "${searchTerm}"...`);
        clearSearch();
      }
    }
  };

  const handleRecentSearchClick = (term) => {
    setSearchTerm(term);
    
    // Trigger search with this term
    const filteredResults = allProducts.filter(product => 
      product.name.toLowerCase().includes(term.toLowerCase()) ||
      product.description.toLowerCase().includes(term.toLowerCase())
    ).slice(0, 5);
    
    setSearchResults(filteredResults);
    setShowResults(true);
  };

  const handlePopularSearchClick = (term) => {
    setSearchTerm(term);
    
    // Trigger search with this term
    const filteredResults = allProducts.filter(product => 
      product.name.toLowerCase().includes(term.toLowerCase()) ||
      product.description.toLowerCase().includes(term.toLowerCase())
    ).slice(0, 5);
    
    setSearchResults(filteredResults);
    setShowResults(true);
  };

  const handleFocus = () => {
    setFocused(true);
    if (searchTerm.length > 1) {
      setShowResults(true);
    }
  };

  return (
    <div className="search-bar-container" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="search-form">
        <div className={`search-input-wrapper ${focused ? 'focused' : ''}`}>
          <FaSearch className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search uniforms, merchandise, accessories..."
            value={searchTerm}
            onChange={handleSearch}
            onFocus={handleFocus}
            className="search-input"
            autoComplete="off"
          />
          {loading && <div className="search-spinner"></div>}
          {searchTerm && (
            <button type="button" className="clear-search" onClick={clearSearch}>
              <FaTimes />
            </button>
          )}
        </div>
        
        {showResults && (
          <div className="search-dropdown">
            {searchResults.length > 0 ? (
              <>
                <div className="search-dropdown-header">
                  <span>Search Results</span>
                </div>
                
                <div className="search-results-list">
                  {searchResults.map((product) => (
                    <div 
                      key={product.id} 
                      className="search-result-item"
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="result-image-container">
                        <img src={product.imageUrl} alt={product.name} className="result-image" />
                        {product.id.startsWith('u') ? (
                          <div className="result-category uniform">
                            <FaTshirt size={10} /> Uniform
                          </div>
                        ) : (
                          <div className="result-category merch">
                            <FaShoppingBag size={10} /> Merch
                          </div>
                        )}
                      </div>
                      <div className="result-details">
                        <h4 className="result-title">{product.name}</h4>
                        <p className="result-price">₱{product.price.toFixed(2)}</p>
                      </div>
                      <div className="result-action">
                        <FaArrowRight />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              searchTerm.length > 1 && (
                <div className="no-results">
                  <p>No products found for "{searchTerm}"</p>
                  <p className="no-results-suggestion">Try different keywords or browse categories</p>
                </div>
              )
            )}
            
            {/* Show recent searches if no search term or results */}
            {(!searchTerm || searchTerm.length <= 1) && recentSearches.length > 0 && (
              <>
                <div className="search-dropdown-header">
                  <span>Recent Searches</span>
                </div>
                <div className="search-suggestion-list">
                  {recentSearches.map((search, index) => (
                    <div 
                      key={index}
                      className="search-suggestion-item"
                      onClick={() => handleRecentSearchClick(search.term)}
                    >
                      <FaHistory className="suggestion-icon" />
                      <span>{search.term}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {/* Popular searches */}
            {(!searchTerm || searchTerm.length <= 1) && (
              <>
                <div className="search-dropdown-header">
                  <span>Popular Searches</span>
                </div>
                <div className="search-suggestion-list">
                  {popularSearches.map((term, index) => (
                    <div 
                      key={index}
                      className="search-suggestion-item"
                      onClick={() => handlePopularSearchClick(term)}
                    >
                      <FaFire className="suggestion-icon popular" />
                      <span>{term}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            <div className="search-dropdown-footer">
              <p>Press Enter to search</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;