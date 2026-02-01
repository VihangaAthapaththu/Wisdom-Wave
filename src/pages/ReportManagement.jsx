import React from 'react';
import { BarChart3, Download, Edit } from 'lucide-react';
import '../styles/management.css';

function ReportManagement() {
  const reports = [
    { id: 1, title: 'Q1 Performance Report', date: '2026-01-20', status: 'Generated' },
    { id: 2, title: 'Student Progress Report', date: '2026-01-18', status: 'Generated' },
    { id: 3, title: 'Course Analytics', date: '2026-01-15', status: 'Generated' },
  ];

  return (
    <div className="management-page">
      <h1 className="management-title">Report Management</h1>

      <div className="management-table-container">
        <table className="management-table">
          <thead>
            <tr>
              <th>Report Title</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td><BarChart3 size={16} className="inline mr-2" />{report.title}</td>
                <td>{report.date}</td>
                <td>{report.status}</td>
                <td>
                  <button className="btn-action edit"><Download size={14} className="inline" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportManagement;
