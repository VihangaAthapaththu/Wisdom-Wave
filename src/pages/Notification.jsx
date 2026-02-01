import React from 'react';
import { Bell, CheckCircle, AlertCircle } from 'lucide-react';
import '../styles/management.css';

function Notification() {
  const notifications = [
    { id: 1, title: 'New Course Available', message: 'A new course has been added', time: '2 hours ago', type: 'info' },
    { id: 2, title: 'Assignment Graded', message: 'Your assignment has been graded', time: '5 hours ago', type: 'success' },
    { id: 3, title: 'System Maintenance', message: 'Scheduled maintenance on Sunday', time: '1 day ago', type: 'warning' },
  ];

  return (
    <div className="management-page">
      <h1 className="management-title">Notifications</h1>

      <div className="management-table-container">
        <table className="management-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Message</th>
              <th>Time</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notif) => (
              <tr key={notif.id}>
                <td><Bell size={16} className="inline mr-2" />{notif.title}</td>
                <td>{notif.message}</td>
                <td>{notif.time}</td>
                <td>
                  {notif.type === 'success' && <CheckCircle size={16} className="inline text-green-500" />}
                  {notif.type === 'warning' && <AlertCircle size={16} className="inline text-orange-500" />}
                  {notif.type === 'info' && <Bell size={16} className="inline text-blue-500" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Notification;
