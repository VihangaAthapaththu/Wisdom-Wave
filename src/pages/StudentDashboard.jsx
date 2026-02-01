import React from 'react';
import { BookOpen, Clock, Award, TrendingUp } from 'lucide-react';
import '../styles/studentDashboard.css';

function StudentDashboard() {
  const stats = [
    { icon: BookOpen, label: 'Courses Enrolled', value: '8' },
    { icon: TrendingUp, label: 'Learning Hours', value: '156' },
    { icon: Award, label: 'Certifications', value: '3' },
    { icon: Clock, label: 'Current Streak', value: '12 days' },
  ];

  const enrolledCourses = [
    {
      id: 1,
      title: 'React Fundamentals',
      progress: 65,
      instructor: 'John Smith',
      startDate: 'Jan 15, 2026'
    },
    {
      id: 2,
      title: 'Advanced JavaScript',
      progress: 45,
      instructor: 'Jane Doe',
      startDate: 'Jan 20, 2026'
    },
    {
      id: 3,
      title: 'Web Design Basics',
      progress: 80,
      instructor: 'Mike Johnson',
      startDate: 'Dec 10, 2025'
    },
  ];

  return (
    <div className="student-dashboard">
      {/* Header */}
      <div className="student-header">
        <h1 className="student-title">My Learning Dashboard</h1>
        <p className="student-subtitle">Keep learning and growing</p>
      </div>

      {/* Stats Grid */}
      <div className="student-stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="student-stat-card">
              <div className="student-stat-icon">
                <Icon size={32} />
              </div>
              <div className="student-stat-content">
                <p className="student-stat-label">{stat.label}</p>
                <p className="student-stat-value">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enrolled Courses */}
      <div className="student-courses-section">
        <h2 className="student-section-title">My Courses</h2>
        <div className="student-courses-list">
          {enrolledCourses.map((course) => (
            <div key={course.id} className="student-course-item">
              <div className="course-info">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-instructor">Instructor: {course.instructor}</p>
                <p className="course-date">Started: {course.startDate}</p>
              </div>
              <div className="course-progress">
                <div className="progress-bar-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{course.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="student-footer">
        <p>&copy; 2026 Wisdom Wave. Keep Learning!</p>
      </footer>
    </div>
  );
}

export default StudentDashboard;
