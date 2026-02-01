import React from 'react';
import { Send, Mail } from 'lucide-react';
import '../styles/management.css';

function MessagePortal() {
  const messages = [
    { id: 1, from: 'John Doe', subject: 'Course Question', time: '2 hours ago', read: false },
    { id: 2, from: 'Jane Smith', subject: 'Assignment Submission', time: '5 hours ago', read: true },
    { id: 3, from: 'Bob Johnson', subject: 'Technical Issue', time: '1 day ago', read: true },
  ];

  return (
    <div className="management-page">
      <h1 className="management-title">Message Portal</h1>

      <div className="management-table-container">
        <table className="management-table">
          <thead>
            <tr>
              <th>From</th>
              <th>Subject</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id}>
                <td>{msg.from}</td>
                <td><Mail size={16} className="inline mr-2" />{msg.subject}</td>
                <td>{msg.time}</td>
                <td>{msg.read ? 'Read' : 'Unread'}</td>
                <td>
                  <button className="btn-action edit">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MessagePortal;
