import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FaFilter, FaSearch, FaTimes, FaChevronRight } from 'react-icons/fa';
import ItemCard from '../components/ItemCard';
import { CATEGORIES, allProducts, getCategory, getSectionForItem, matchesQuery } from '../data/catalog';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
];

const sorters = {
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'name-asc': (a, b) => a.name.localeCompare(b.name),
};

// Handles both /browse (all products) and /section/:sectionId (one category).
const Section = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const category = sectionId ? getCategory(sectionId) : null;
  const items = category ? category.items : allProducts;
  const title = category ? category.title : 'Browse Products';
  const subtitle = category
    ? category.subtitle
    : 'Official NU uniforms and Bulldog merchandise, all in one place';

  const [sort, setSort] = useState('featured');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', filtersOpen);
    if (!filtersOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setFiltersOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', onKey);
    };
  }, [filtersOpen]);

  const results = useMemo(() => {
    const min = minPrice === '' ? -Infinity : Number(minPrice);
    const max = maxPrice === '' ? Infinity : Number(maxPrice);
    const filtered = items.filter(
      (item) => matchesQuery(item, query) && item.price >= min && item.price <= max
    );
    return sorters[sort] ? [...filtered].sort(sorters[sort]) : filtered;
  }, [items, query, minPrice, maxPrice, sort]);

  const setQuery = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set('q', value);
    else next.delete('q');
    setSearchParams(next, { replace: true });
  };

  const categoryHref = (id) => {
    const base = id ? `/section/${id}` : '/browse';
    return query ? `${base}?q=${encodeURIComponent(query)}` : base;
  };

  const activeCategoryId = category ? category.id : null;
  const hasPriceFilter = minPrice !== '' || maxPrice !== '';

  const resetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSort('featured');
    navigate('/browse');
  };

  const renderFilterPanel = (prefix) => (
    <>
      <fieldset className="filter-group">
        <legend>Category</legend>
        {[{ id: null, label: 'All Products', count: allProducts.length },
          ...CATEGORIES.map((c) => ({ id: c.id, label: c.label, count: c.items.length }))].map((c) => (
          <label key={c.label} className="radio-row">
            <input
              type="radio"
              name={`${prefix}-category`}
              checked={activeCategoryId === c.id}
              onChange={() => navigate(categoryHref(c.id))}
            />
            <span>{c.label}</span>
            <span className="radio-row__count">{c.count}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="filter-group">
        <legend>Price (₱)</legend>
        <div className="price-range">
          <label>
            <span className="sr-only">Minimum price</span>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </label>
          <span aria-hidden="true">–</span>
          <label>
            <span className="sr-only">Maximum price</span>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="filter-group">
        <legend>Sort by</legend>
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </fieldset>

      <button type="button" className="btn btn--outline btn--block" onClick={resetFilters}>
        Reset filters
      </button>
    </>
  );

  return (
    <div className="browse">
      <div className="page-header">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <FaChevronRight aria-hidden="true" />
            {category ? (
              <>
                <Link to="/browse">Browse</Link>
                <FaChevronRight aria-hidden="true" />
                <span aria-current="page">{category.label}</span>
              </>
            ) : (
              <span aria-current="page">Browse</span>
            )}
          </nav>
          <h1 className="page-header__title">{title}</h1>
          <p className="page-header__subtitle">{subtitle}</p>

          <div className="page-header__search">
            <FaSearch className="page-header__search-icon" aria-hidden="true" />
            <input
              type="search"
              className="input input--lg"
              placeholder={category ? `Search ${category.label.toLowerCase()}...` : 'Search all products...'}
              aria-label="Search items"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="chip-row" role="list" aria-label="Categories">
            <Link role="listitem" to={categoryHref(null)} className={`chip-link ${!activeCategoryId ? 'is-active' : ''}`}>
              All
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                role="listitem"
                key={c.id}
                to={categoryHref(c.id)}
                className={`chip-link ${activeCategoryId === c.id ? 'is-active' : ''}`}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container browse__layout">
        <aside className="filters filters--sidebar" aria-label="Filters">
          <h2 className="filters__title">Filters</h2>
          {renderFilterPanel("sidebar")}
        </aside>

        <section className="browse__results" aria-labelledby="results-heading">
          <div className="results-toolbar">
            <div>
              <h2 id="results-heading" className="results-toolbar__title">
                {category ? `All ${category.label}` : 'All Products'}
              </h2>
              <p className="results-toolbar__count" aria-live="polite">
                Showing {results.length} of {items.length} items
                {query && <> for “{query}”</>}
              </p>
            </div>
            <div className="results-toolbar__actions">
              <button
                type="button"
                className="btn btn--outline btn--sm filters-toggle"
                onClick={() => setFiltersOpen(true)}
                aria-haspopup="dialog"
              >
                <FaFilter aria-hidden="true" /> Filters
                {hasPriceFilter && <span className="dot" aria-label="active" />}
              </button>
              <label className="results-toolbar__sort">
                <span className="sr-only">Sort products</span>
                <select className="input input--sm" value={sort} onChange={(e) => setSort(e.target.value)}>
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {(query || hasPriceFilter) && (
            <div className="active-filters">
              {query && (
                <button type="button" className="filter-pill" onClick={() => setQuery('')}>
                  “{query}” <FaTimes aria-label="Remove search filter" />
                </button>
              )}
              {hasPriceFilter && (
                <button type="button" className="filter-pill" onClick={() => { setMinPrice(''); setMaxPrice(''); }}>
                  ₱{minPrice || '0'} – {maxPrice ? `₱${maxPrice}` : 'any'} <FaTimes aria-label="Remove price filter" />
                </button>
              )}
            </div>
          )}

          {results.length > 0 ? (
            <div className="products-grid products-grid--browse">
              {results.map((item) => (
                <ItemCard key={item.id} item={item} section={category ? category.id : getSectionForItem(item)} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FaSearch className="empty-state__icon" aria-hidden="true" />
              <h3>No items match your filters</h3>
              <p>Try a different search term or clear your filters.</p>
              <button type="button" className="btn btn--primary" onClick={resetFilters}>Clear all filters</button>
            </div>
          )}
        </section>
      </div>

      {/* Mobile filter drawer */}
      <div
        className={`drawer-backdrop ${filtersOpen ? 'is-open' : ''}`}
        onClick={() => setFiltersOpen(false)}
        aria-hidden="true"
      />
      <div
        className={`filters filters--drawer ${filtersOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        inert={!filtersOpen}
      >
        <div className="filters__drawer-head">
          <h2 className="filters__title">Filters</h2>
          <button type="button" className="header-icon-btn" onClick={() => setFiltersOpen(false)} aria-label="Close filters">
            <FaTimes aria-hidden="true" />
          </button>
        </div>
        <div className="filters__drawer-body">{renderFilterPanel("drawer")}</div>
        <div className="filters__drawer-foot">
          <button type="button" className="btn btn--primary btn--block" onClick={() => setFiltersOpen(false)}>
            Show {results.length} items
          </button>
        </div>
      </div>
    </div>
  );
};

export default Section;
