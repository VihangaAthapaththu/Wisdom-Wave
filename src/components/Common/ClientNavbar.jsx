import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/clientNavbar.css';

function ClientNavbar() {
  return (
    <header className="landing-header">
      <div className="header-container">
        <div className="logo">
          <img src="/logo.png" alt="Wisdom Wave" className="logo-image" />
          <span className="logo-text">Wisdom</span>
        </div>
        <nav className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/courses" className="nav-link">Courses</Link>
          <Link to="/blog" className="nav-link">Blog</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/signin" className="nav-link">Sign In</Link>
          <Link to="/signin" className="btn-primary">Get Started</Link>
        </nav>
      </div>
    </header>
  );
}

export default ClientNavbar;
