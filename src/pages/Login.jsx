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
  FaChevronRight,
  FaCheck
} from 'react-icons/fa';
import logo from '../assets/nubdexchange_logo.png';
import AuthShell from '../components/AuthShell';

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
    <AuthShell
      heading="Welcome back, Bulldog!"
      message="The official online store for National University Philippines merchandise and uniforms."
      features={[
        { icon: FaUser, text: 'Exclusive discounts for NU students' },
        { icon: FaSchool, text: 'Official NU uniforms and merchandise' },
      ]}
    >
      <div className="auth-card__head">
        <img src={logo} alt="" className="auth-card__logo" />
        <h1>Sign in to your account</h1>
        <p>Use your NU email to continue.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="form">
        <div className={`field ${formErrors.email ? 'has-error' : ''}`}>
          <label htmlFor="email">Email Address</label>
          <div className="field__control">
            <FaEnvelope className="field__icon" aria-hidden="true" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="student@nu.edu.ph"
              value={formData.email}
              onChange={handleChange}
              required
              aria-invalid={!!formErrors.email}
              aria-describedby={formErrors.email ? 'email-error' : undefined}
              disabled={isLoading}
            />
          </div>
          {formErrors.email && <div id="email-error" className="field__error" role="alert">{formErrors.email}</div>}
        </div>

        <div className={`field ${formErrors.password ? 'has-error' : ''}`}>
          <label htmlFor="password">Password</label>
          <div className="field__control">
            <FaLock className="field__icon" aria-hidden="true" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              aria-invalid={!!formErrors.password}
              aria-describedby={formErrors.password ? 'password-error' : undefined}
              disabled={isLoading}
            />
            <button
              type="button"
              className="field__toggle"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
            </button>
          </div>
          {formErrors.password && <div id="password-error" className="field__error" role="alert">{formErrors.password}</div>}
        </div>

        <div className="form__row-between">
          <label className="checkbox">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              disabled={isLoading}
            />
            <span>Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-link">Forgot password?</Link>
        </div>

        {formErrors.auth && <div className="alert alert--danger" role="alert">{formErrors.auth}</div>}

        <button
          type="submit"
          className={`btn btn--primary btn--lg btn--block ${loginStatus === 'success' ? 'btn--success' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner" aria-hidden="true"></span>
              <span>Signing In...</span>
            </>
          ) : loginStatus === 'success' ? (
            <>
              <FaCheck aria-hidden="true" />
              <span>Signed In!</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <FaChevronRight aria-hidden="true" />
            </>
          )}
        </button>
      </form>

      <div className="divider-text"><span>OR</span></div>

      <button
        type="button"
        className="btn btn--outline btn--lg btn--block"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <FaGoogle aria-hidden="true" />
        <span>Sign in with Google</span>
      </button>

      <p className="auth-card__foot">
        Don't have an account? <Link to="/signup" className="text-link">Register Now</Link>
      </p>
    </AuthShell>
  );
};

export default Login;
