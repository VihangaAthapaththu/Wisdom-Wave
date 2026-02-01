import React from 'react';
import { Clock, Users, Search } from 'lucide-react';
import '../styles/courseList.css';

function CourseList() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedLevel, setSelectedLevel] = React.useState('all');

  const courses = [
    {
      id: 1,
      title: 'Introduction to Python',
      level: 'Beginner',
      duration: '4 weeks',
      students: 1200,
      icon: '🐍',
      description: 'Learn Python basics and build your first projects'
    },
    {
      id: 2,
      title: 'React Native',
      level: 'Intermediate',
      duration: '6 weeks',
      students: 2500,
      icon: '⚛️',
      description: 'Build mobile apps with React and JavaScript'
    },
    {
      id: 3,
      title: 'Networking with Java',
      level: 'Advanced',
      duration: '8 weeks',
      students: 3100,
      icon: '☕',
      description: 'Master networking concepts with Java programming'
    },
    {
      id: 4,
      title: 'Web Development Basics',
      level: 'Beginner',
      duration: '5 weeks',
      students: 1800,
      icon: '🌐',
      description: 'Learn HTML, CSS, and JavaScript for web development'
    },
    {
      id: 5,
      title: 'Advanced JavaScript',
      level: 'Advanced',
      duration: '7 weeks',
      students: 950,
      icon: '✨',
      description: 'Deep dive into JavaScript ES6+ and modern patterns'
    },
    {
      id: 6,
      title: 'Data Science Fundamentals',
      level: 'Intermediate',
      duration: '6 weeks',
      students: 2100,
      icon: '📊',
      description: 'Introduction to data analysis and visualization'
    },
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="courses-list-page">
      {/* Main Content */}
      <div className="courses-container">
        {/* Title Section */}
        <div className="courses-title-section">
          <h1 className="courses-page-title">Explore Our Courses</h1>
          <p className="courses-page-subtitle">Choose from hundreds of courses and start learning today</p>
        </div>

        {/* Filters */}
        <div className="courses-filters">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="level-filters">
            <button
              className={`filter-btn ${selectedLevel === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedLevel('all')}
            >
              All Levels
            </button>
            <button
              className={`filter-btn ${selectedLevel === 'Beginner' ? 'active' : ''}`}
              onClick={() => setSelectedLevel('Beginner')}
            >
              Beginner
            </button>
            <button
              className={`filter-btn ${selectedLevel === 'Intermediate' ? 'active' : ''}`}
              onClick={() => setSelectedLevel('Intermediate')}
            >
              Intermediate
            </button>
            <button
              className={`filter-btn ${selectedLevel === 'Advanced' ? 'active' : ''}`}
              onClick={() => setSelectedLevel('Advanced')}
            >
              Advanced
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <div key={course.id} className="course-card-link">
              <div className="course-card-list">
                <div className="course-card-icon">{course.icon}</div>
                <div className="course-card-badge">{course.level}</div>
                
                <h3 className="course-card-title">{course.title}</h3>
                <p className="course-card-desc">{course.description}</p>
                
                <div className="course-card-footer">
                  <div className="course-meta-list">
                    <div className="meta-item">
                      <Clock size={16} />
                      <span>{course.duration}</span>
                    </div>
                    <div className="meta-item">
                      <Users size={16} />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <button className="btn-course-card">Enroll Now</button>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="no-courses">
            <p>No courses found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="courses-footer">
        <p>&copy; 2026 Wisdom Wave. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default CourseList;
