import React from 'react';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import '../styles/management.css';

function CourseManagement() {
  const courses = [
    { id: 1, title: 'React Fundamentals', instructor: 'John Smith', students: 234, lessons: 12 },
    { id: 2, title: 'Advanced JavaScript', instructor: 'Jane Doe', students: 156, lessons: 18 },
    { id: 3, title: 'Web Design Basics', instructor: 'Mike Johnson', students: 342, lessons: 8 },
    { id: 4, title: 'Python for Beginners', instructor: 'Sarah Wilson', students: 89, lessons: 15 },
  ];

  return (
    <div className="management-page">
      <div className="management-header">
        <h1 className="management-title">Course Management</h1>
        <button className="management-btn-primary">
          <Plus size={20} /> Add Course
        </button>
      </div>

      <div className="management-table-container">
        <table className="management-table">
          <thead>
            <tr>
              <th>Course Title</th>
              <th>Instructor</th>
              <th>Students</th>
              <th>Lessons</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td><BookOpen size={16} className="inline mr-2" />{course.title}</td>
                <td>{course.instructor}</td>
                <td>{course.students}</td>
                <td>{course.lessons}</td>
                <td>
                  <button className="btn-action edit">Edit</button>
                  <button className="btn-action delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CourseManagement;
