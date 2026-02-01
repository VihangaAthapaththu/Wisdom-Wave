import React from 'react';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import '../styles/management.css';

function BlogManagement() {
  const blogs = [
    { id: 1, title: 'Getting Started with React', author: 'John Smith', date: '2026-01-15', status: 'Published' },
    { id: 2, title: 'JavaScript Best Practices', author: 'Jane Doe', date: '2026-01-18', status: 'Draft' },
    { id: 3, title: 'Web Design Trends 2026', author: 'Mike Johnson', date: '2026-01-20', status: 'Published' },
  ];

  return (
    <div className="management-page">
      <div className="management-header">
        <h1 className="management-title">Blog Management</h1>
        <button className="management-btn-primary">
          <Plus size={20} /> New Post
        </button>
      </div>

      <div className="management-table-container">
        <table className="management-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td><FileText size={16} className="inline mr-2" />{blog.title}</td>
                <td>{blog.author}</td>
                <td>{blog.date}</td>
                <td>{blog.status}</td>
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

export default BlogManagement;
