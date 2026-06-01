import React from 'react';
import { Mail, MessageSquare } from 'lucide-react';
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import { PageHeader } from '@/components/molecules';

export function MessagePortal() {
  const messages = [
    { id: 1, from: 'John Doe', subject: 'Course Question', time: '2 hours ago', read: false },
    { id: 2, from: 'Jane Smith', subject: 'Assignment Submission', time: '5 hours ago', read: true },
    { id: 3, from: 'Bob Johnson', subject: 'Technical Issue', time: '1 day ago', read: true },
  ];

  return (
    <div className="bg-bg-paper min-h-screen p-4 md:p-6 lg:p-10 flex flex-col">
      <PageHeader title="Message Portal" />

      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-bg-surface border-b-2 border-primary">
            <TableRow>
              <TableHead className="font-bold text-text-strong p-4">From</TableHead>
              <TableHead className="font-bold text-text-strong p-4">Subject</TableHead>
              <TableHead className="font-bold text-text-strong p-4">Time</TableHead>
              <TableHead className="font-bold text-text-strong p-4">Status</TableHead>
              <TableHead className="font-bold text-text-strong p-4">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted py-12">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-border" />
                  <p className="font-medium">No messages yet.</p>
                </TableCell>
              </TableRow>
            ) : messages.map((msg) => (
              <TableRow key={msg.id} className="hover:bg-bg-surface border-b border-border">
                <TableCell className="text-text-strong p-4 font-medium">
                  <span className={`inline-flex items-center gap-2 ${!msg.read ? 'font-semibold' : ''}`}>
                    {!msg.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                    {msg.from}
                  </span>
                </TableCell>
                <TableCell className="text-muted p-4"><Mail size={16} className="inline mr-2" />{msg.subject}</TableCell>
                <TableCell className="text-muted p-4 text-sm">{msg.time}</TableCell>
                <TableCell className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    msg.read ? 'bg-gray-100 text-gray-500' : 'bg-primary/10 text-primary'
                  }`}>{msg.read ? 'Read' : 'Unread'}</span>
                </TableCell>
                <TableCell className="p-4">
                  <Button size="sm" variant="outline">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
