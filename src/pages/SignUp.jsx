import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/signup.css';

function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign Up:', formData);
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-left">
          <div className="signup-logo-circle">W</div>
          <h1 className="signup-brand-title">Create your account</h1>
          <p className="signup-brand-subtitle">
            Start learning with curated IT pathways, hands-on projects, and
            certifications that boost your career.
          </p>

          <div className="signup-features">
            <div className="signup-feature">
              <div className="signup-feature-icon">✓</div>
              <span>Personalized learning paths</span>
            </div>
            <div className="signup-feature">
              <div className="signup-feature-icon">✓</div>
              <span>Industry-recognized certificates</span>
            </div>
            <div className="signup-feature">
              <div className="signup-feature-icon">✓</div>
              <span>Mentor support and community</span>
            </div>
            <div className="signup-feature">
              <div className="signup-feature-icon">✓</div>
              <span>Track progress in real time</span>
            </div>
          </div>
        </div>

        <div className="signup-right">
          <h2 className="signup-form-title">Sign Up</h2>
          <p className="signup-form-subtitle">Create your Wisdom Wave account in minutes</p>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="signup-form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="signup-form-group">
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

            <div className="signup-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />
            </div>

            <div className="signup-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
              />
            </div>

            <div className="signup-checkbox-group">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                required
              />
              <label htmlFor="acceptTerms">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            <button type="submit" className="signup-btn">
              Create Account
            </button>
          </form>

          <div className="signup-signin-link">
            Already have an account? <Link to="/signin">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
