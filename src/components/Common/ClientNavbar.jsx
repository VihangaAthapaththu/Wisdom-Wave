import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/clientNavbar.css';

function ClientNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

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

          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              )}
              {user.role === 'STUDENT' && (
                <Link to="/student-dashboard" className="nav-link">Dashboard</Link>
              )}
              <span className="nav-user-name">{user.name}</span>
              <button onClick={handleLogout} className="btn-primary btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="nav-link">Sign In</Link>
              <Link to="/signin" className="btn-primary">Get Started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default ClientNavbar;
