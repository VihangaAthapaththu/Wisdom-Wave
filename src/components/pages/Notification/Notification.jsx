import React from 'react';
import { Bell, CheckCircle, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import { PageHeader } from '@/components/molecules';

export function Notification() {
  const notifications = [
    { id: 1, title: 'New Course Available', message: 'A new course has been added', time: '2 hours ago', type: 'info' },
    { id: 2, title: 'Assignment Graded', message: 'Your assignment has been graded', time: '5 hours ago', type: 'success' },
    { id: 3, title: 'System Maintenance', message: 'Scheduled maintenance on Sunday', time: '1 day ago', type: 'warning' },
  ];

  return (
    <div className="bg-bg-paper min-h-screen p-4 md:p-6 lg:p-10 flex flex-col">
      <PageHeader title="Notifications" />

      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-bg-surface border-b-2 border-primary">
            <TableRow>
              <TableHead className="font-bold text-text-strong p-4">Title</TableHead>
              <TableHead className="font-bold text-text-strong p-4">Message</TableHead>
              <TableHead className="font-bold text-text-strong p-4">Time</TableHead>
              <TableHead className="font-bold text-text-strong p-4">Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notif) => (
              <TableRow key={notif.id} className="hover:bg-bg-surface border-b border-border">
                <TableCell className="text-muted p-4"><Bell size={16} className="inline mr-2" />{notif.title}</TableCell>
                <TableCell className="text-muted p-4">{notif.message}</TableCell>
                <TableCell className="text-muted p-4">{notif.time}</TableCell>
                <TableCell className="p-4">
                  {notif.type === 'success' && <CheckCircle size={16} className="inline text-success" />}
                  {notif.type === 'warning' && <AlertCircle size={16} className="inline text-warn" />}
                  {notif.type === 'info' && <Bell size={16} className="inline text-blue-500" />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
