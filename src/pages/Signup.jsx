import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaLock, 
  FaUser, 
  FaIdCard, 
  FaGraduationCap, 
  FaCheck, 
  FaSchool, 
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaArrowRight,
  FaShieldAlt
} from 'react-icons/fa';
import logo from '../assets/nubdexchange_logo.png';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    course: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const navigate = useNavigate();

  // Reset relevant errors when typing
  useEffect(() => {
    const newErrors = { ...formErrors };
    
    if (step === 1) {
      if (formData.firstName && newErrors.firstName) delete newErrors.firstName;
      if (formData.lastName && newErrors.lastName) delete newErrors.lastName;
      if (formData.email && newErrors.email) delete newErrors.email;
      if (formData.password && newErrors.password) delete newErrors.password;
      if (formData.confirmPassword && newErrors.confirmPassword) delete newErrors.confirmPassword;
      if (formData.password === formData.confirmPassword) delete newErrors.match;
    } else {
      if (formData.studentId && newErrors.studentId) delete newErrors.studentId;
      if (formData.course && newErrors.course) delete newErrors.course;
    }
    
    setFormErrors(newErrors);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Check password strength
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  };

  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
      case 0: return { label: 'Very Weak', color: '#ff4444' };
      case 1: return { label: 'Weak', color: '#ff8c1a' };
      case 2: return { label: 'Fair', color: '#ffcc00' };
      case 3: return { label: 'Good', color: '#b3e600' };
      case 4: return { label: 'Strong', color: '#47d147' };
      case 5: return { label: 'Very Strong', color: '#00b33c' };
      default: return { label: '', color: '#e0e0e0' };
    }
  };

  const validateStep1 = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
    } else if (!formData.email.toLowerCase().includes('nu.edu.ph') && 
              !formData.email.toLowerCase().includes('example.com')) {
      errors.email = 'Please use your NU email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength < 3) {
      errors.password = 'Please create a stronger password';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.match = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors = {};
    
    if (!formData.studentId.trim()) {
      errors.studentId = 'Student ID is required';
    } else if (!/^\d{4}-\d{6}$|^\d{10}$/.test(formData.studentId.trim())) {
      errors.studentId = 'Please enter a valid student ID format';
    }
    
    if (!formData.course) {
      errors.course = 'Course/Program is required';
    }
    
    if (!acceptTerms) {
      errors.terms = 'You must accept the terms to proceed';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setIsLoading(true);
    setRegistrationStatus('processing');
    
    // Simulate registration process
    setTimeout(() => {
      // Store user info in localStorage
      const userInfo = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        studentId: formData.studentId,
        course: formData.course,
        joined: 'May 1, 2025'
      };
      
      localStorage.setItem('nuUser', JSON.stringify(userInfo));
      
      setRegistrationStatus('success');
      
      // Navigate after success animation
      setTimeout(() => {
        navigate('/');
      }, 800);
    }, 1500);
  };

  const handleGoogleSignup = () => {
    setIsLoading(true);
    
    // Simulate Google signup process
    setTimeout(() => {
      const userInfo = {
        name: 'NU Student',
        email: 'student@nu.edu.ph',
        studentId: '2025-123456',
        course: 'BSIT',
        joined: 'May 1, 2025'
      };
      
      localStorage.setItem('nuUser', JSON.stringify(userInfo));
      navigate('/');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="form-container signup-form">
        <div className="form-logo">
          <img src={logo} alt="NU Bulldogs Exchange" />
          <h2>NU Bulldogz Exchange</h2>
        </div>

        <h1>{step === 1 ? 'Create Your Account' : 'Student Information'}</h1>
        
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">{step > 1 ? <FaCheck /> : 1}</div>
            <div className="step-label">Account Details</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Student Info</div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} noValidate>
          {step === 1 ? (
            // Step 1 - Account Details
            <>
              <div className="form-row">
                <div className={`form-group ${formErrors.firstName ? 'error' : ''}`}>
                  <label htmlFor="firstName">
                    <FaUser className="input-icon" /> First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className={formErrors.firstName ? 'error-input' : ''}
                    disabled={isLoading}
                  />
                  {formErrors.firstName && <div className="error-message">{formErrors.firstName}</div>}
                </div>
                
                <div className={`form-group ${formErrors.lastName ? 'error' : ''}`}>
                  <label htmlFor="lastName">
                    <FaUser className="input-icon" /> Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className={formErrors.lastName ? 'error-input' : ''}
                    disabled={isLoading}
                  />
                  {formErrors.lastName && <div className="error-message">{formErrors.lastName}</div>}
                </div>
              </div>
              
              <div className={`form-group ${formErrors.email ? 'error' : ''}`}>
                <label htmlFor="email">
                  <FaEnvelope className="input-icon" /> Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your NU email (e.g., student@nu.edu.ph)"
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
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={formErrors.password ? 'error-input' : ''}
                    disabled={isLoading}
                  />
                  <button 
                    type="button" 
                    className="password-toggle" 
                    onClick={() => togglePasswordVisibility('password')}
                    tabIndex="-1"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {formData.password && (
                  <div className="password-strength-container">
                    <div className="password-strength-meter">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div 
                          key={level} 
                          className={`strength-segment ${passwordStrength >= level ? 'active' : ''}`}
                          style={{ 
                            backgroundColor: passwordStrength >= level 
                              ? getPasswordStrengthLabel().color 
                              : '#e0e0e0' 
                          }}
                        ></div>
                      ))}
                    </div>
                    <div className="strength-label">
                      <FaShieldAlt style={{ marginRight: '5px', color: getPasswordStrengthLabel().color }} />
                      <span style={{ color: getPasswordStrengthLabel().color }}>
                        {getPasswordStrengthLabel().label}
                      </span>
                    </div>
                  </div>
                )}
                {formErrors.password && <div className="error-message">{formErrors.password}</div>}
              </div>
              
              <div className={`form-group ${formErrors.confirmPassword || formErrors.match ? 'error' : ''}`}>
                <label htmlFor="confirmPassword">
                  <FaLock className="input-icon" /> Confirm Password
                </label>
                <div className="password-input-container">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={(formErrors.confirmPassword || formErrors.match) ? 'error-input' : ''}
                    disabled={isLoading}
                  />
                  <button 
                    type="button" 
                    className="password-toggle" 
                    onClick={() => togglePasswordVisibility('confirm')}
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {formErrors.confirmPassword && <div className="error-message">{formErrors.confirmPassword}</div>}
                {formErrors.match && <div className="error-message">{formErrors.match}</div>}
              </div>
              
              <button 
                type="button" 
                className="auth-button next-button"
                onClick={handleNextStep}
                disabled={isLoading}
              >
                <span>Continue</span>
                <FaArrowRight style={{ marginLeft: '8px' }} />
              </button>
              
              <div className="form-divider">
                <span>OR</span>
              </div>
              
              <div className="social-login">
                <button 
                  type="button"
                  className="google-btn"
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                >
                  <FaGoogle />
                  <span>Sign up with Google</span>
                </button>
              </div>
            </>
          ) : (
            // Step 2 - Student Information
            <>
              <div className="form-row">
                <div className={`form-group ${formErrors.studentId ? 'error' : ''}`}>
                  <label htmlFor="studentId">
                    <FaIdCard className="input-icon" /> Student ID
                  </label>
                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    placeholder="Enter student ID (e.g., 2023-123456)"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                    className={formErrors.studentId ? 'error-input' : ''}
                    disabled={isLoading}
                  />
                  {formErrors.studentId && <div className="error-message">{formErrors.studentId}</div>}
                </div>
                
                <div className={`form-group ${formErrors.course ? 'error' : ''}`}>
                  <label htmlFor="course">
                    <FaGraduationCap className="input-icon" /> Course/Program
                  </label>
                  <select
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    className={formErrors.course ? 'error-input' : ''}
                    disabled={isLoading}
                  >
                    <option value="">Select your course</option>
                    <option value="BSIT">BS Information Technology</option>
                    <option value="BSCS">BS Computer Science</option>
                    <option value="BSN">BS Nursing</option>
                    <option value="BSBA">BS Business Administration</option>
                    <option value="BSHRM">BS Hotel & Restaurant Management</option>
                    <option value="BSEd">BS Education</option>
                    <option value="BSA">BS Accountancy</option>
                    <option value="BSCrim">BS Criminology</option>
                  </select>
                  {formErrors.course && <div className="error-message">{formErrors.course}</div>}
                </div>
              </div>
              
              <div className={`form-terms ${formErrors.terms ? 'error' : ''}`}>
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                  disabled={isLoading}
                />
                <label htmlFor="terms">
                  I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>, and confirm that I am a National University student.
                </label>
                {formErrors.terms && <div className="error-message">{formErrors.terms}</div>}
              </div>
              
              <div className="form-buttons">
                <button 
                  type="button" 
                  className="back-button"
                  onClick={handlePrevStep}
                  disabled={isLoading}
                >
                  <FaArrowLeft style={{ marginRight: '5px' }} /> Back
                </button>
                
                <button 
                  type="submit" 
                  className={`auth-button ${isLoading ? 'loading' : ''} ${registrationStatus === 'success' ? 'success' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      <span>Creating Account...</span>
                    </>
                  ) : registrationStatus === 'success' ? (
                    <>
                      <FaCheck style={{ marginRight: '8px' }} />
                      <span>Account Created!</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
        
        <div className="form-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
      
      <div className="auth-banner">
        <div className="auth-overlay">
          <h2>Join the NU Bulldogz Exchange</h2>
          <p>Get access to exclusive NU uniforms, merchandise, and student discounts.</p>
          
          <div className="auth-features">
            <div className="feature-item">
              <FaIdCard className="feature-icon" />
              <span>Student ID verification</span>
            </div>
            <div className="feature-item">
              <FaUser className="feature-icon" />
              <span>Personalized recommendations</span>
            </div>
            <div className="feature-item">
              <FaSchool className="feature-icon" />
              <span>Campus delivery options</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 