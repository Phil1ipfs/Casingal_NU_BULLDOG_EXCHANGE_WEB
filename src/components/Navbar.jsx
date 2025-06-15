import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaTshirt, 
  FaShoppingBag, 
  FaShoppingCart, 
  FaUser,
  FaSignOutAlt,
  FaStore,
  FaSearch,
  FaTimes,
  FaBars,
  FaHeart,
  FaClipboardList,
  FaCog,
  FaQuestionCircle,
  FaBell,
  FaUserCircle,
  FaChevronDown,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEnvelope
} from 'react-icons/fa';
import logo from '../assets/nubdexchange_logo.png';
import { useCart } from '../context/CartContext';
import SearchBar from './SearchBar';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const { cartCount } = useCart();
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const userMenuRef = useRef(null);
  
  useEffect(() => {
    const savedUser = localStorage.getItem('nuUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [location.pathname]);
  
  const handleLogout = () => {
    localStorage.removeItem('nuUser');
    setUser(null);
    navigate('/login');
  };
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (searchOpen) setSearchOpen(false);
  };
  
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };
  
  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  // Check if we're on mobile view based on window width
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
      // Close mobile menu and search if resizing to desktop
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <nav className={`bulldogs-navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-logo">
            <Link to="/">
              <img src={logo} alt="NU Bulldogs Exchange" />
            </Link>
          </div>
          
          <div className="navbar-main">
            <div className="navbar-links">
              <Link to="/" className={isActive('/') && !location.pathname.includes('section') ? 'active' : ''}>
                <FaStore className="nav-icon" />
                <span>Shop</span>
              </Link>
              
              <div className="has-mega-menu">
                <Link to="/section/uniforms" className={isActive('/section/uniforms') ? 'active' : ''}>
                  <FaTshirt className="nav-icon" />
                  <span>Uniforms</span>
                </Link>
                
                <div className="mega-menu-wrapper">
                  <div className="mega-menu">
                    <div className="mega-menu-column">
                      <h3 className="mega-menu-title">Academic Programs</h3>
                      <div className="mega-menu-links">
                        <Link to="/section/uniforms?program=nursing" className="mega-menu-link">Nursing Uniforms</Link>
                        <Link to="/section/uniforms?program=hrm" className="mega-menu-link">HRM Uniforms</Link>
                        <Link to="/section/uniforms?program=engineering" className="mega-menu-link">Engineering Uniforms</Link>
                        <Link to="/section/uniforms?program=education" className="mega-menu-link">Education Uniforms</Link>
                        <Link to="/section/uniforms?program=business" className="mega-menu-link">Business Uniforms</Link>
                      </div>
                    </div>
                    <div className="mega-menu-column">
                      <h3 className="mega-menu-title">Uniform Types</h3>
                      <div className="mega-menu-links">
                        <Link to="/section/uniforms?type=daily" className="mega-menu-link">Daily Wear</Link>
                        <Link to="/section/uniforms?type=formal" className="mega-menu-link">Formal Events</Link>
                        <Link to="/section/uniforms?type=pe" className="mega-menu-link">PE Uniforms</Link>
                        <Link to="/section/uniforms?type=clinical" className="mega-menu-link">Clinical Practice</Link>
                        <Link to="/section/uniforms?type=internship" className="mega-menu-link">Internship Attire</Link>
                      </div>
                    </div>
                    <div className="mega-menu-column">
                      <div className="mega-menu-featured">
                        <img src="https://scontent-mnl3-1.xx.fbcdn.net/v/t39.30808-6/469958669_1312994066808730_5405078896215908282_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=f727a1&_nc_ohc=cUjyjAvusboQ7kNvwGubKkf&_nc_oc=AdmzYeE9Vor3uJkRbQsESiicyxnZpdC4mCLswZLFrJJGvRITqPSZqj-sB4NpV3IRL9U&_nc_zt=23&_nc_ht=scontent-mnl3-1.xx&_nc_gid=nru5vTQV4HRgD1_kM_cPQQ&oh=00_AfGZWF22o3t9-d1tslRAVIUBbu0Q-dVHq0vII4r1piQgaQ&oe=6814B2F1" alt="Featured Uniform" />
                        <h4>New Collection 2025</h4>
                        <p>Discover our latest uniform designs with improved comfort and durability</p>
                        <Link to="/section/uniforms?collection=new" className="mega-menu-link">Shop New Arrivals →</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="has-mega-menu">
                <Link to="/section/school-merch" className={isActive('/section/school-merch') ? 'active' : ''}>
                  <FaShoppingBag className="nav-icon" />
                  <span>Merchandise</span>
                </Link>
                
                <div className="mega-menu-wrapper">
                  <div className="mega-menu">
                    <div className="mega-menu-column">
                      <h3 className="mega-menu-title">Clothing</h3>
                      <div className="mega-menu-links">
                        <Link to="/section/school-merch?category=tshirts" className="mega-menu-link">T-Shirts</Link>
                        <Link to="/section/school-merch?category=hoodies" className="mega-menu-link">Hoodies & Jackets</Link>
                        <Link to="/section/school-merch?category=caps" className="mega-menu-link">Caps & Hats</Link>
                        <Link to="/section/school-merch?category=sportswear" className="mega-menu-link">Sportswear</Link>
                      </div>
                    </div>
                    <div className="mega-menu-column">
                      <h3 className="mega-menu-title">Accessories</h3>
                      <div className="mega-menu-links">
                        <Link to="/section/school-merch?category=bags" className="mega-menu-link">Bags & Backpacks</Link>
                        <Link to="/section/school-merch?category=lanyards" className="mega-menu-link">ID Lanyards</Link>
                        <Link to="/section/school-merch?category=stationery" className="mega-menu-link">Stationery</Link>
                        <Link to="/section/school-merch?category=pins" className="mega-menu-link">Pins & Badges</Link>
                      </div>
                    </div>
                    <div className="mega-menu-column">
                      <div className="mega-menu-featured">
                        <img src="https://scontent.fmnl8-4.fna.fbcdn.net/v/t39.30808-6/469494258_1312368613537942_7637345218561107250_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGZdwsrrn9j9w_hudo4f1RPxGmVljdVT4TEaZWWN1VPhO3d_TEohAdlFJp3MhNxYxI3Lq9j_x-FgdqkNSJX1Znz&_nc_ohc=nj4P0ZQJSr4Q7kNvwFLWLfS&_nc_oc=AdmgbeWMGTECYctALTy37XJSJNoggFJjjcNVIoQhBJaEitSunP3-3Vi3gq9JW5RihMs&_nc_zt=23&_nc_ht=scontent.fmnl8-4.fna&_nc_gid=FGKeayGYXULW3yboVw_aSw&oh=00_AfHqvja8wD_kBOhtZecnPXC4TJ2HP2fka-Oe9geyVyLnng&oe=6816D954" alt="Featured Merch" />
                        <h4>NU Bulldogs Pride Collection</h4>
                        <p>Show your school spirit with our exclusive Bulldogs merchandise</p>
                        <Link to="/section/school-merch?collection=pride" className="mega-menu-link">Shop Collection →</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Link to="/cart" className={isActive('/cart') ? 'active' : ''}>
                <div className="cart-icon-container">
                  <FaShoppingCart className="nav-icon" />
                  <span>Cart</span>
                  {cartCount > 0 && <div className="cart-badge">{cartCount}</div>}
                </div>
              </Link>
              
              <Link to="/profile" className={isActive('/profile') ? 'active' : ''}>
                <FaUser className="nav-icon" />
                <span>Account</span>
              </Link>
            </div>
            
            {/* Only show search form in desktop view */}
            {!isMobileView && (
              <div className="search-form">
                <SearchBar />
              </div>
            )}
            
            <div className="navbar-user" ref={userMenuRef}>
              {user ? (
                <>
                  <button 
                    className="user-profile-btn"
                    onClick={toggleUserDropdown}
                  >
                    <span className="user-greeting">Welcome, {user.name.split(' ')[0]}</span>
                    <FaUserCircle size={24} />
                    <FaChevronDown size={12} style={{ opacity: 0.7 }} />
                    {userDropdownOpen && (
                      <div className="user-dropdown show">
                        <div className="dropdown-item">
                          <FaUserCircle className="icon" size={18} />
                          <span>My Profile</span>
                        </div>
                        <div className="dropdown-item">
                          <FaClipboardList className="icon" size={18} />
                          <span>My Orders</span>
                        </div>
                        <div className="dropdown-item">
                          <FaHeart className="icon" size={18} />
                          <span>Wishlist</span>
                        </div>
                        <div className="dropdown-divider"></div>
                        <div className="dropdown-item">
                          <FaCog className="icon" size={18} />
                          <span>Settings</span>
                        </div>
                        <div className="dropdown-item">
                          <FaQuestionCircle className="icon" size={18} />
                          <span>Help Center</span>
                        </div>
                        <div className="dropdown-divider"></div>
                        <div 
                          className="dropdown-item"
                          onClick={handleLogout}
                        >
                          <FaSignOutAlt className="icon" size={18} />
                          <span>Logout</span>
                        </div>
                      </div>
                    )}
                  </button>
                  <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="auth-links">
                  <Link to="/login" className="auth-link">
                    <span>Sign In</span>
                  </Link>
                  <Link to="/signup" className="auth-link register">
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </div>
            
            <button className="search-toggle" onClick={toggleSearch}>
              {searchOpen ? <FaTimes /> : <FaSearch />}
            </button>
            
            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
        
        {/* Secondary Navbar - Shows only on desktop */}
        {/* <div className="navbar-secondary">
          <div className="navbar-secondary-links">
            <a href="tel:+12345678" className="navbar-secondary-link">
              <FaPhoneAlt size={10} /> Support: (123) 456-7890
            </a>
            <Link to="/stores" className="navbar-secondary-link">
              <FaMapMarkerAlt size={10} /> Store Locations
            </Link>
            <Link to="/contact" className="navbar-secondary-link">
              <FaEnvelope size={10} /> Contact Us
            </Link>
          </div>
        </div> */}
        
        {/* Mobile Search Container - Only show in mobile view and when search is open */}
        {isMobileView && searchOpen && (
          <div className="mobile-search-container show">
            <SearchBar />
          </div>
        )}
      </nav>
      
      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'show' : ''}`}>
        <div className="mobile-menu-header">
          {user ? (
            <div>
              <h3>Welcome, {user.name.split(' ')[0]}</h3>
              <p>{user.email}</p>
            </div>
          ) : (
            <h3>Menu</h3>
          )}
        </div>
        
        <div className="mobile-menu-links">
          <Link to="/" className="mobile-menu-link">
            <FaHome className="icon" />
            <span>Home</span>
          </Link>
          
          <Link to="/section/uniforms" className="mobile-menu-link">
            <FaTshirt className="icon" />
            <span>Uniforms</span>
          </Link>
          
          <Link to="/section/school-merch" className="mobile-menu-link">
            <FaShoppingBag className="icon" />
            <span>Merchandise</span>
          </Link>
          
          <Link to="/cart" className="mobile-menu-link">
            <FaShoppingCart className="icon" />
            <span>Cart</span>
            {cartCount > 0 && <div className="cart-badge mobile">{cartCount}</div>}
          </Link>
          
          <Link to="/profile" className="mobile-menu-link">
            <FaUser className="icon" />
            <span>My Account</span>
          </Link>
          
          <Link to="/wishlist" className="mobile-menu-link">
            <FaHeart className="icon" />
            <span>Wishlist</span>
          </Link>
          
          <Link to="/orders" className="mobile-menu-link">
            <FaClipboardList className="icon" />
            <span>Orders</span>
          </Link>
        </div>
        
        <div className="mobile-menu-footer">
          {!user ? (
            <div className="auth-buttons">
              <Link to="/login" className="auth-button signin-btn">Sign In</Link>
              <Link to="/signup" className="auth-button register-btn">Register</Link>
            </div>
          ) : (
            <button className="auth-button register-btn" onClick={handleLogout}>
              <FaSignOutAlt style={{ marginRight: '8px' }} /> Logout
            </button>
          )}
          
          <p>© 2025 NU Bulldogz Exchange</p>
        </div>
      </div>
    </>
  );
};

export default Navbar;