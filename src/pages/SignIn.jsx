import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/signin.css';

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign In:', formData);
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
              />
            </div>

            <div className="signin-checkbox-group">
              <input
                type="checkbox"
                id="remember"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="remember">Remember me for 30 days</label>
            </div>

            <div className="signin-forgot-link">
              <a href="#forgot">Forgot your password?</a>
            </div>

            <button type="submit" className="signin-btn">
              Sign In
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
