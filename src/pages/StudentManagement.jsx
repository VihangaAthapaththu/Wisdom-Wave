import React from 'react';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import '../styles/management.css';

function StudentManagement() {
  const students = [
    { id: 1, name: 'John Doe', email: 'john@example.com', courses: 5, status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', courses: 3, status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', courses: 2, status: 'Inactive' },
  ];

  return (
    <div className="management-page">
      <div className="management-header">
        <h1 className="management-title">Student Management</h1>
        <button className="management-btn-primary">
          <Plus size={20} /> Add Student
        </button>
      </div>

      <div className="management-table-container">
        <table className="management-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Courses</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td><Users size={16} className="inline mr-2" />{student.name}</td>
                <td>{student.email}</td>
                <td>{student.courses}</td>
                <td>{student.status}</td>
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

export default StudentManagement;
