import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Users } from 'lucide-react';
import '../styles/landingPage.css';

function LandingPage() {
  const courses = [
    {
      id: 1,
      title: 'Introduction to Python',
      duration: '4 weeks',
      students: '1.2K students',
      level: 'Beginner',
      icon: '🐍'
    },
    {
      id: 2,
      title: 'React Native',
      duration: '6 weeks',
      students: '2.5K students',
      level: 'Intermediate',
      icon: '⚛️'
    },
    {
      id: 3,
      title: 'Networking with Java',
      duration: '8 weeks',
      students: '3.1K students',
      level: 'Advanced',
      icon: '☕'
    },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">Learning the world's greatest</div>
            <h1 className="hero-title">Build Your IT Career<br />with<br />Wisdom Wave</h1>
            <p className="hero-description">
              Build real-world IT skills, learn from industry experts, and get career-ready with hands-on projects. Join Wisdom Wave and start your journey toward becoming an IT professional.
            </p>
            <div className="hero-buttons">
              <button className="btn-hero-primary">Start Learning →</button>
              <button className="btn-hero-secondary">▶ Watch Demo</button>
            </div>
          </div>
          <div className="hero-logo">
            <img src="/logo.png" alt="Wisdom Wave" className="hero-logo-image" />
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="why-section">
        <h2 className="section-title">Why wisdom wave?</h2>
        <div className="why-divider"></div>

        <div className="why-cards">
          <div className="why-card">
            <div className="why-icon">📘</div>
            <h3>Best Quality Contents</h3>
            <p>Progressive levels from beginner to expert with hands-on tutorials.</p>
          </div>
          <div className="why-card">
            <div className="why-icon">🧭</div>
            <h3>IT Career Guidance</h3>
            <p>After learning, apply directly and get prepared for your job.</p>
          </div>
          <div className="why-card">
            <div className="why-icon">🎓</div>
            <h3>Valuable Certificate</h3>
            <p>An industry level certification will be provided.</p>
          </div>
          <div className="why-card">
            <div className="why-icon">👩‍🏫</div>
            <h3>Well Qualified Academics</h3>
            <p>Qualified academic staff will guide you during the course.</p>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="courses-section">
        <h2 className="section-title text-center">Featured Courses</h2>
        
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-icon">{course.icon}</div>
              <div className="course-badge">{course.level}</div>
              
              <h3 className="course-title">{course.title}</h3>
              
              <div className="course-info">
                <div className="course-meta">
                  <Clock size={16} />
                  <span>{course.duration}</span>
                </div>
                <div className="course-meta">
                  <Users size={16} />
                  <span>{course.students}</span>
                </div>
              </div>
              
              <button className="btn-enroll">Enroll Now</button>
            </div>
          ))}
        </div>
        
        <div className="show-all-section">
          <Link to="/courses" className="show-all-link">Show all Courses</Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-divider"></div>
        <h2 className="cta-title">Ready to Start Your IT Journey?</h2>
        <p className="cta-subtitle">Join thousands of students learning IT development with Wisdom Wave</p>
        <button className="btn-cta">Create Free Account →</button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-divider"></div>
        <div className="footer-container">
          <div className="footer-column">
            <h4>Wisdom Wave</h4>
            <p>Empowering the next generation of IT innovators</p>
          </div>
          
          <div className="footer-column">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/">Learning</Link></li>
              <li><a href="#">Blog Platform</a></li>
              <li><a href="#">Community</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Access</h4>
            <ul>
              <li><a href="#">Student Login</a></li>
              <li><a href="#">Admin Portal</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-logo">
            <img src="/logo.png" alt="Wisdom Wave" className="footer-logo-image" />
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 Wisdom Wave. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
