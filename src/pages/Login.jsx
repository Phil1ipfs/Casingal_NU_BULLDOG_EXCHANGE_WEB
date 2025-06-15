import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaLock, 
  FaUser, 
  FaSchool,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaChevronRight
} from 'react-icons/fa';
import logo from '../assets/nubdexchange_logo.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null);
  const navigate = useNavigate();

  // Reset error when typing
  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      setFormErrors({});
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setLoginStatus('processing');
    
    // Simulate login process
    setTimeout(() => {
      // Check if credentials are valid (for demo purposes)
      if (formData.email.includes('@nu.edu.ph') || formData.email.includes('@example.com')) {
        // Store user information in localStorage
        const userInfo = {
          name: formData.email.split('@')[0], 
          email: formData.email,
          joined: 'April 30, 2025'
        };
        
        localStorage.setItem('nuUser', JSON.stringify(userInfo));
        setLoginStatus('success');
        
        // Navigate after successful login animation
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        setFormErrors({
          auth: 'Invalid email or password. Please try again.'
        });
        setLoginStatus('error');
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    
    // Simulate Google login process
    setTimeout(() => {
      const userInfo = {
        name: 'NU Student', 
        email: 'student@nu.edu.ph',
        joined: 'April 30, 2025'
      };
      
      localStorage.setItem('nuUser', JSON.stringify(userInfo));
      navigate('/');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="form-container login-form">
        <div className="form-logo">
          <img src={logo} alt="NU Bulldogs Exchange" />
          <h2>NU Bulldogz Exchange</h2>
        </div>

        <h1>Sign In to Your Account</h1>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className={`form-group ${formErrors.email ? 'error' : ''}`}>
            <label htmlFor="email">
              <FaEnvelope className="input-icon" /> Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className={formErrors.email ? 'error-input' : ''}
              disabled={isLoading}
            />
            {formErrors.email && <div className="error-message">{formErrors.email}</div>}
          </div>
          
          <div className={`form-group ${formErrors.password ? 'error' : ''}`}>
            <label htmlFor="password">
              <FaLock className="input-icon" /> Password
            </label>
            <div className="password-input-container">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className={formErrors.password ? 'error-input' : ''}
                disabled={isLoading}
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={togglePasswordVisibility}
                tabIndex="-1"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formErrors.password && <div className="error-message">{formErrors.password}</div>}
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                disabled={isLoading}
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
          </div>
          
          {formErrors.auth && <div className="auth-error-message">{formErrors.auth}</div>}
          
          <button 
            type="submit" 
            className={`auth-button ${isLoading ? 'loading' : ''} ${loginStatus === 'success' ? 'success' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>Signing In...</span>
              </>
            ) : loginStatus === 'success' ? (
              <>
                <FaCheck style={{ marginRight: '8px' }} />
                <span>Signed In!</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <FaChevronRight style={{ marginLeft: '8px', fontSize: '0.8rem' }} />
              </>
            )}
          </button>
        </form>
        
        <div className="form-divider">
          <span>OR</span>
        </div>
        
        <div className="social-login">
          <button 
            className="google-btn"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <FaGoogle alt="Google" />
            <span>Sign in with Google</span>
          </button>
        </div>
        
        <div className="form-footer">
          <p>Don't have an account? <Link to="/signup">Register Now</Link></p>
        </div>
      </div>
      
      <div className="auth-banner">
        <div className="auth-overlay">
          <h2>Welcome to NU Bulldogz Exchange</h2>
          <p>The official online store for National University Philippines merchandise and uniforms.</p>
          
          <div className="auth-features">
            <div className="feature-item">
              <FaUser className="feature-icon" />
              <span>Exclusive discounts for NU students</span>
            </div>
            <div className="feature-item">
              <FaSchool className="feature-icon" />
              <span>Official NU uniforms and merchandise</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;