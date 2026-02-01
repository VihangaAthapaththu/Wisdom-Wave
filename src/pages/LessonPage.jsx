import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import '../styles/contentPage.css';

function LessonPage() {
  return (
    <div className="content-page">
      <div className="content-header">
        <h1 className="content-title">Lesson 1: Introduction to React</h1>
        <p className="content-subtitle">Learn the fundamentals of React</p>
      </div>

      <div className="content-grid">
        <div className="content-main">
          <div className="content-card">
            <h2>Lesson Content</h2>
            <p>React is a JavaScript library for building user interfaces with reusable components. This lesson covers the basics.</p>
          </div>

          <div className="content-card">
            <h2>Key Concepts</h2>
            <ul className="content-list">
              <li><CheckCircle size={16} className="inline mr-2" />Components</li>
              <li><CheckCircle size={16} className="inline mr-2" />Props</li>
              <li><CheckCircle size={16} className="inline mr-2" />State</li>
              <li><CheckCircle size={16} className="inline mr-2" />JSX</li>
            </ul>
          </div>
        </div>

        <div className="content-sidebar">
          <div className="content-info-card">
            <p className="info-label">Lesson Progress</p>
            <div style={{width: '100%', height: '8px', background: '#f5f5f5', borderRadius: '10px', overflow: 'hidden'}}>
              <div style={{width: '65%', height: '100%', background: 'linear-gradient(90deg, #FFA500, #ff8c00)'}}></div>
            </div>
            <button className="content-btn-primary" style={{marginTop: '12px'}}>
              Continue <ArrowRight size={16} className="inline ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonPage;
