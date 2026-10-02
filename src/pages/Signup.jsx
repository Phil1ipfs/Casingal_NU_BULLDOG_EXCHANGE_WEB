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
import AuthShell from '../components/AuthShell';

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

  const strength = getPasswordStrengthLabel();

  return (
    <AuthShell
      heading="Join the NU Bulldog Exchange"
      message="Get access to exclusive NU uniforms, merchandise, and student discounts."
      features={[
        { icon: FaIdCard, text: 'Student ID verification' },
        { icon: FaUser, text: 'Personalized recommendations' },
        { icon: FaSchool, text: 'Campus delivery options' },
      ]}
    >
      <div className="auth-card__head">
        <img src={logo} alt="" className="auth-card__logo" />
        <h1>{step === 1 ? 'Create your account' : 'Student information'}</h1>
        <p>{step === 1 ? 'Start with your account details.' : 'Tell us about your NU enrollment.'}</p>
      </div>

      <ol className="steps" aria-label="Registration progress">
        <li className={`steps__item ${step >= 1 ? 'is-active' : ''} ${step > 1 ? 'is-done' : ''}`} aria-current={step === 1 ? 'step' : undefined}>
          <span className="steps__num">{step > 1 ? <FaCheck aria-hidden="true" /> : 1}</span>
          <span className="steps__label">Account Details</span>
        </li>
        <li className="steps__line" aria-hidden="true" />
        <li className={`steps__item ${step >= 2 ? 'is-active' : ''}`} aria-current={step === 2 ? 'step' : undefined}>
          <span className="steps__num">2</span>
          <span className="steps__label">Student Info</span>
        </li>
      </ol>

      <form onSubmit={handleSubmit} noValidate className="form">
        {step === 1 ? (
          // Step 1 - Account Details
          <>
            <div className="form__grid">
              <div className={`field ${formErrors.firstName ? 'has-error' : ''}`}>
                <label htmlFor="firstName">First Name</label>
                <div className="field__control">
                  <FaUser className="field__icon" aria-hidden="true" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    aria-invalid={!!formErrors.firstName}
                    disabled={isLoading}
                  />
                </div>
                {formErrors.firstName && <div className="field__error" role="alert">{formErrors.firstName}</div>}
              </div>

              <div className={`field ${formErrors.lastName ? 'has-error' : ''}`}>
                <label htmlFor="lastName">Last Name</label>
                <div className="field__control">
                  <FaUser className="field__icon" aria-hidden="true" />
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    aria-invalid={!!formErrors.lastName}
                    disabled={isLoading}
                  />
                </div>
                {formErrors.lastName && <div className="field__error" role="alert">{formErrors.lastName}</div>}
              </div>
            </div>

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
                  disabled={isLoading}
                />
              </div>
              {formErrors.email ? (
                <div className="field__error" role="alert">{formErrors.email}</div>
              ) : (
                <div className="field__hint">Use your NU email address</div>
              )}
            </div>

            <div className={`field ${formErrors.password ? 'has-error' : ''}`}>
              <label htmlFor="password">Password</label>
              <div className="field__control">
                <FaLock className="field__icon" aria-hidden="true" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  aria-invalid={!!formErrors.password}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="field__toggle"
                  onClick={() => togglePasswordVisibility('password')}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
                </button>
              </div>
              {formData.password && (
                <div className="strength">
                  <div className="strength__meter" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <span
                        key={level}
                        className="strength__seg"
                        style={{
                          backgroundColor: passwordStrength >= level ? strength.color : undefined
                        }}
                      />
                    ))}
                  </div>
                  <span className="strength__label">
                    <FaShieldAlt aria-hidden="true" style={{ color: strength.color }} />
                    Password strength: {strength.label}
                  </span>
                </div>
              )}
              {formErrors.password && <div className="field__error" role="alert">{formErrors.password}</div>}
            </div>

            <div className={`field ${formErrors.confirmPassword || formErrors.match ? 'has-error' : ''}`}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="field__control">
                <FaLock className="field__icon" aria-hidden="true" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  aria-invalid={!!(formErrors.confirmPassword || formErrors.match)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="field__toggle"
                  onClick={() => togglePasswordVisibility('confirm')}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
                </button>
              </div>
              {formErrors.confirmPassword && <div className="field__error" role="alert">{formErrors.confirmPassword}</div>}
              {formErrors.match && <div className="field__error" role="alert">{formErrors.match}</div>}
            </div>

            <button
              type="button"
              className="btn btn--primary btn--lg btn--block"
              onClick={handleNextStep}
              disabled={isLoading}
            >
              <span>Continue</span>
              <FaArrowRight aria-hidden="true" />
            </button>

            <div className="divider-text"><span>OR</span></div>

            <button
              type="button"
              className="btn btn--outline btn--lg btn--block"
              onClick={handleGoogleSignup}
              disabled={isLoading}
            >
              <FaGoogle aria-hidden="true" />
              <span>Sign up with Google</span>
            </button>
          </>
        ) : (
          // Step 2 - Student Information
          <>
            <div className="form__grid">
              <div className={`field ${formErrors.studentId ? 'has-error' : ''}`}>
                <label htmlFor="studentId">Student ID</label>
                <div className="field__control">
                  <FaIdCard className="field__icon" aria-hidden="true" />
                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    placeholder="e.g., 2023-123456"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                    aria-invalid={!!formErrors.studentId}
                    disabled={isLoading}
                  />
                </div>
                {formErrors.studentId && <div className="field__error" role="alert">{formErrors.studentId}</div>}
              </div>

              <div className={`field ${formErrors.course ? 'has-error' : ''}`}>
                <label htmlFor="course">Course/Program</label>
                <div className="field__control">
                  <FaGraduationCap className="field__icon" aria-hidden="true" />
                  <select
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    aria-invalid={!!formErrors.course}
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
                </div>
                {formErrors.course && <div className="field__error" role="alert">{formErrors.course}</div>}
              </div>
            </div>

            <div className={`field ${formErrors.terms ? 'has-error' : ''}`}>
              <label className="checkbox checkbox--top">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                  disabled={isLoading}
                />
                <span>
                  I agree to the <a href="#" className="text-link">Terms & Conditions</a> and <a href="#" className="text-link">Privacy Policy</a>, and confirm that I am a National University student.
                </span>
              </label>
              {formErrors.terms && <div className="field__error" role="alert">{formErrors.terms}</div>}
            </div>

            <div className="form__actions">
              <button
                type="button"
                className="btn btn--outline btn--lg"
                onClick={handlePrevStep}
                disabled={isLoading}
              >
                <FaArrowLeft aria-hidden="true" /> Back
              </button>

              <button
                type="submit"
                className={`btn btn--primary btn--lg ${registrationStatus === 'success' ? 'btn--success' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" aria-hidden="true"></span>
                    <span>Creating Account...</span>
                  </>
                ) : registrationStatus === 'success' ? (
                  <>
                    <FaCheck aria-hidden="true" />
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

      <p className="auth-card__foot">
        Already have an account? <Link to="/login" className="text-link">Sign In</Link>
      </p>
    </AuthShell>
  );
};

export default Signup;
