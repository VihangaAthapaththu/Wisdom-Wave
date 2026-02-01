import React from 'react';
import { Users, BookOpen, FileText, BarChart3, Settings, LogOut } from 'lucide-react';
import '../styles/adminDashboard.css';

function AdminDashboard() {
  const stats = [
    { icon: Users, label: 'Total Students', value: '1,234', color: 'orange' },
    { icon: BookOpen, label: 'Active Courses', value: '28', color: 'orange' },
    { icon: FileText, label: 'Course Materials', value: '156', color: 'orange' },
    { icon: BarChart3, label: 'Enrollments', value: '5,678', color: 'orange' },
  ];

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Welcome back, Administrator</p>
        </div>
        <div className="admin-actions">
          <button className="admin-btn-icon">
            <Settings size={20} />
          </button>
          <button className="admin-btn-logout">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="admin-stat-card">
              <div className="stat-icon">
                <Icon size={32} />
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Menu Grid */}
      <div className="admin-menu-section">
        <h2 className="admin-section-title">Management</h2>
        <div className="admin-menu-grid">
          <a href="/dashboard/courses" className="admin-menu-card">
            <BookOpen size={40} />
            <h3>Course Management</h3>
            <p>Manage courses and content</p>
          </a>
          <a href="/dashboard/students" className="admin-menu-card">
            <Users size={40} />
            <h3>Student Management</h3>
            <p>Manage student accounts</p>
          </a>
          <a href="/dashboard/students/enrollments" className="admin-menu-card">
            <FileText size={40} />
            <h3>Enrollments</h3>
            <p>Track student enrollments</p>
          </a>
          <a href="/dashboard/blog" className="admin-menu-card">
            <FileText size={40} />
            <h3>Blog Management</h3>
            <p>Create and manage blog posts</p>
          </a>
          <a href="/dashboard/reports" className="admin-menu-card">
            <BarChart3 size={40} />
            <h3>Reports</h3>
            <p>View analytics and reports</p>
          </a>
          <a href="/dashboard/courses/1/materials" className="admin-menu-card">
            <BookOpen size={40} />
            <h3>Course Materials</h3>
            <p>Manage course materials</p>
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="admin-footer">
        <p>&copy; 2026 Wisdom Wave Admin Panel. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AdminDashboard;
