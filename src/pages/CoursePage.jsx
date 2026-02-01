import React from 'react';
import { BookOpen, Users, Clock, Star } from 'lucide-react';
import '../styles/contentPage.css';

function CoursePage() {
  return (
    <div className="content-page">
      <div className="content-header">
        <h1 className="content-title">React Fundamentals</h1>
        <p className="content-subtitle">Master the basics of React and build amazing web applications</p>
      </div>

      <div className="content-grid">
        <div className="content-main">
          <div className="content-card">
            <h2>Course Overview</h2>
            <p>This comprehensive course teaches you everything you need to know about React, from basic concepts to advanced patterns.</p>
          </div>

          <div className="content-card">
            <h3>What You'll Learn</h3>
            <ul className="content-list">
              <li>React Components and JSX</li>
              <li>State Management with Hooks</li>
              <li>Component Lifecycle</li>
              <li>API Integration</li>
              <li>Building Real Projects</li>
            </ul>
          </div>
        </div>

        <div className="content-sidebar">
          <div className="content-info-card">
            <div className="info-item">
              <Clock size={20} />
              <div>
                <p className="info-label">Duration</p>
                <p className="info-value">6 weeks</p>
              </div>
            </div>
            <div className="info-item">
              <Users size={20} />
              <div>
                <p className="info-label">Students</p>
                <p className="info-value">1,234</p>
              </div>
            </div>
            <div className="info-item">
              <Star size={20} />
              <div>
                <p className="info-label">Rating</p>
                <p className="info-value">4.8/5.0</p>
              </div>
            </div>
            <button className="content-btn-primary">Enroll Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
