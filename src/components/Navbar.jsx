import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaTshirt,
  FaShoppingBag,
  FaShoppingCart,
  FaSignOutAlt,
  FaStore,
  FaSearch,
  FaTimes,
  FaBars,
  FaHeart,
  FaRegHeart,
  FaClipboardList,
  FaUserCircle,
  FaChevronDown,
} from 'react-icons/fa';
import logo from '../assets/nubdexchange_logo.png';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import SearchBar from './SearchBar';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: FaHome, end: true },
  { to: '/browse', label: 'Browse', icon: FaStore },
  { to: '/section/uniforms', label: 'Uniforms', icon: FaTshirt },
  { to: '/section/school-merch', label: 'Merchandise', icon: FaShoppingBag },
];

const getInitials = (name = '') =>
  name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'NU';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const { cartCount } = useCart();
  const { favorites } = useFavorites();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const userMenuRef = useRef(null);

  // Re-read the signed-in user on every navigation (login/logout happen on other pages).
  useEffect(() => {
    const savedUser = localStorage.getItem('nuUser');
    setUser(savedUser ? JSON.parse(savedUser) : null);
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setUserDropdownOpen(false);
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };
    const handleResize = () => {
      if (window.innerWidth > 900) setMobileMenuOpen(false);
      if (window.innerWidth > 1200) setSearchOpen(false);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Lock page scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.classList.toggle('no-scroll', mobileMenuOpen);
    return () => document.body.classList.remove('no-scroll');
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('nuUser');
    setUser(null);
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (searchOpen) setSearchOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const firstName = user?.name?.split(' ')[0];

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container site-header__inner">
          <Link to="/" className="brand" aria-label="NU Bulldog Exchange home">
            <img src={logo} alt="" className="brand__logo" />
            <span className="brand__text">
              <strong>NU Bulldog</strong>
              <span>Exchange</span>
            </span>
          </Link>

          <nav className="main-nav" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className="main-nav__link">
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="site-header__search">
            <SearchBar variant="nav" />
          </div>

          <div className="site-header__actions">
            <button
              type="button"
              className="header-icon-btn search-toggle"
              onClick={toggleSearch}
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              aria-expanded={searchOpen}
            >
              {searchOpen ? <FaTimes aria-hidden="true" /> : <FaSearch aria-hidden="true" />}
            </button>

            <NavLink to="/wishlist" className="header-icon-btn hide-xs" aria-label={`Saved items (${favorites.length})`}>
              <FaRegHeart aria-hidden="true" />
              {favorites.length > 0 && <span className="count-badge count-badge--muted">{favorites.length}</span>}
            </NavLink>

            <NavLink to="/cart" className="header-icon-btn" aria-label={`Cart (${cartCount} items)`}>
              <FaShoppingCart aria-hidden="true" />
              {cartCount > 0 && <span className="count-badge">{cartCount}</span>}
            </NavLink>

            {user ? (
              <div className="user-menu" ref={userMenuRef}>
                <button
                  type="button"
                  className="user-menu__trigger"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-haspopup="menu"
                  aria-expanded={userDropdownOpen}
                >
                  <span className="avatar avatar--sm" aria-hidden="true">{getInitials(user.name)}</span>
                  <span className="user-menu__name">{firstName}</span>
                  <FaChevronDown className="user-menu__chevron" aria-hidden="true" />
                </button>
                <div className={`dropdown ${userDropdownOpen ? 'is-open' : ''}`} role="menu">
                  <div className="dropdown__header">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                  <Link to="/profile" className="dropdown__item" role="menuitem">
                    <FaUserCircle aria-hidden="true" /> My Profile
                  </Link>
                  <Link to="/profile" className="dropdown__item" role="menuitem">
                    <FaClipboardList aria-hidden="true" /> My Orders
                  </Link>
                  <Link to="/wishlist" className="dropdown__item" role="menuitem">
                    <FaHeart aria-hidden="true" /> Saved Items
                  </Link>
                  <div className="dropdown__divider" />
                  <button type="button" className="dropdown__item dropdown__item--danger" role="menuitem" onClick={handleLogout}>
                    <FaSignOutAlt aria-hidden="true" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="btn btn--ghost btn--sm">Sign In</Link>
                <Link to="/signup" className="btn btn--primary btn--sm">Register</Link>
              </div>
            )}

            <button
              type="button"
              className="header-icon-btn menu-toggle"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-drawer"
            >
              {mobileMenuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="mobile-search">
            <div className="container">
              <SearchBar variant="nav" autoFocus />
            </div>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      <div
        className={`drawer-backdrop ${mobileMenuOpen ? 'is-open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />
      <aside
        id="mobile-drawer"
        className={`mobile-drawer ${mobileMenuOpen ? 'is-open' : ''}`}
        aria-label="Mobile menu"
        aria-hidden={!mobileMenuOpen}
        inert={!mobileMenuOpen}
      >
        <div className="mobile-drawer__header">
          {user ? (
            <div className="mobile-drawer__user">
              <span className="avatar" aria-hidden="true">{getInitials(user.name)}</span>
              <div>
                <strong>Welcome, {firstName}</strong>
                <span>{user.email}</span>
              </div>
            </div>
          ) : (
            <strong>Menu</strong>
          )}
          <button type="button" className="header-icon-btn" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        <nav className="mobile-drawer__links" aria-label="Mobile">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink key={link.to} to={link.to} end={link.end} className="mobile-drawer__link">
                <Icon aria-hidden="true" /> {link.label}
              </NavLink>
            );
          })}
          <div className="mobile-drawer__divider" />
          <NavLink to="/cart" className="mobile-drawer__link">
            <FaShoppingCart aria-hidden="true" /> Cart
            {cartCount > 0 && <span className="count-badge count-badge--inline">{cartCount}</span>}
          </NavLink>
          <NavLink to="/wishlist" className="mobile-drawer__link">
            <FaHeart aria-hidden="true" /> Saved Items
            {favorites.length > 0 && <span className="count-badge count-badge--inline count-badge--muted">{favorites.length}</span>}
          </NavLink>
          <NavLink to="/profile" className="mobile-drawer__link">
            <FaUserCircle aria-hidden="true" /> My Account &amp; Orders
          </NavLink>
        </nav>

        <div className="mobile-drawer__footer">
          {!user ? (
            <div className="mobile-drawer__auth">
              <Link to="/login" className="btn btn--outline btn--block">Sign In</Link>
              <Link to="/signup" className="btn btn--primary btn--block">Register</Link>
            </div>
          ) : (
            <button type="button" className="btn btn--outline btn--block" onClick={handleLogout}>
              <FaSignOutAlt aria-hidden="true" /> Logout
            </button>
          )}
          <p>© {new Date().getFullYear()} NU Bulldog Exchange</p>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
