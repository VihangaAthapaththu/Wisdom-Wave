import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/signin.css';

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear errors on input change
    if (error) setError('');
    if (fieldErrors.length) setFieldErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors([]);
    setIsLoading(true);

    try {
      const user = await login(formData.email, formData.password);

      // Redirect based on role
      if (user.role === 'ADMIN') {
        navigate('/dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (err) {
      const response = err.response?.data;

      if (response?.errors) {
        setFieldErrors(response.errors);
      } else {
        setError(response?.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        {/* Left Side - Branding */}
        <div className="signin-left">
          <div className="signin-logo-circle">W</div>
          <h1 className="signin-brand-title">Welcome to Wisdom Wave</h1>
          <p className="signin-brand-subtitle">
            Join thousands of learners mastering IT skills. Start your journey to a successful tech career today.
          </p>
          
          <div className="signin-features">
            <div className="signin-feature">
              <div className="signin-feature-icon">✓</div>
              <span>Comprehensive IT courses</span>
            </div>
            <div className="signin-feature">
              <div className="signin-feature-icon">✓</div>
              <span>Learn from industry experts</span>
            </div>
            <div className="signin-feature">
              <div className="signin-feature-icon">✓</div>
              <span>Interactive lessons & projects</span>
            </div>
            <div className="signin-feature">
              <div className="signin-feature-icon">✓</div>
              <span>Certification upon completion</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="signin-right">
          <h2 className="signin-form-title">Sign In</h2>
          <p className="signin-form-subtitle">Enter your credentials to access your account</p>

          {/* Error Messages */}
          {error && (
            <div className="signin-error-alert">
              {error}
            </div>
          )}
          {fieldErrors.length > 0 && (
            <div className="signin-error-alert">
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                {fieldErrors.map((fe, i) => (
                  <li key={i}>{fe.message}</li>
                ))}
              </ul>
            </div>
          )}

          <form className="signin-form" onSubmit={handleSubmit}>
            <div className="signin-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="signin-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <div className="signin-checkbox-group">
              <input
                type="checkbox"
                id="remember"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={isLoading}
              />
              <label htmlFor="remember">Remember me for 30 days</label>
            </div>

            <div className="signin-forgot-link">
              <a href="#forgot">Forgot your password?</a>
            </div>

            <button type="submit" className="signin-btn" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="signin-signup-link">
            Don't have an account? <Link to="/signup">Create one now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
