import React from 'react';
import { Plus, Edit, Trash2, FileText, Download } from 'lucide-react';
import '../styles/management.css';

function CourseMaterialManagement() {
  const materials = [
    { id: 1, title: 'Lecture 1 - Introduction', type: 'PDF', date: '2026-01-15', size: '2.4 MB' },
    { id: 2, title: 'Lecture 2 - Components', type: 'Video', date: '2026-01-18', size: '156 MB' },
    { id: 3, title: 'Quiz 1', type: 'Document', date: '2026-01-20', size: '0.8 MB' },
  ];

  return (
    <div className="management-page">
      <div className="management-header">
        <h1 className="management-title">Course Materials</h1>
        <button className="management-btn-primary">
          <Plus size={20} /> Upload Material
        </button>
      </div>

      <div className="management-table-container">
        <table className="management-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Date</th>
              <th>Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => (
              <tr key={material.id}>
                <td><FileText size={16} className="inline mr-2" />{material.title}</td>
                <td>{material.type}</td>
                <td>{material.date}</td>
                <td>{material.size}</td>
                <td>
                  <button className="btn-action edit"><Download size={14} /></button>
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

export default CourseMaterialManagement;
