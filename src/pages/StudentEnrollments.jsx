import React from 'react';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import '../styles/management.css';

function StudentEnrollments() {
  const enrollments = [
    { id: 1, student: 'John Doe', course: 'React Fundamentals', date: '2026-01-15', progress: 65 },
    { id: 2, student: 'Jane Smith', course: 'Advanced JavaScript', date: '2026-01-18', progress: 45 },
    { id: 3, student: 'Bob Johnson', course: 'Web Design Basics', date: '2026-01-20', progress: 80 },
  ];

  return (
    <div className="management-page">
      <h1 className="management-title">Student Enrollments</h1>

      <div className="management-table-container">
        <table className="management-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Date</th>
              <th>Progress</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id}>
                <td>{enrollment.student}</td>
                <td><BookOpen size={16} className="inline mr-2" />{enrollment.course}</td>
                <td>{enrollment.date}</td>
                <td>{enrollment.progress}%</td>
                <td><CheckCircle size={16} className="inline text-green-500 mr-2" />Active</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentEnrollments;
