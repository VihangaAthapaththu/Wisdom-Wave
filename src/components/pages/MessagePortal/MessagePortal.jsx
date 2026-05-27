import React from 'react';
import { Mail } from 'lucide-react';
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import { PageHeader } from '@/components/molecules';

export function MessagePortal() {
  const messages = [
    { id: 1, from: 'John Doe', subject: 'Course Question', time: '2 hours ago', read: false },
    { id: 2, from: 'Jane Smith', subject: 'Assignment Submission', time: '5 hours ago', read: true },
    { id: 3, from: 'Bob Johnson', subject: 'Technical Issue', time: '1 day ago', read: true },
  ];

  return (
    <div className="bg-[#faf8f5] min-h-screen p-4 md:p-6 lg:p-10 flex flex-col">
      <PageHeader title="Message Portal" />

      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-[#f5f5f5] border-b-2 border-[#FFA500]">
            <TableRow>
              <TableHead className="font-bold text-[#1a1a1a] p-4">From</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Subject</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Time</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Status</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((msg) => (
              <TableRow key={msg.id} className="hover:bg-[#f5f5f5] border-b border-[#e0e0e0]">
                <TableCell className="text-[#666666] p-4">{msg.from}</TableCell>
                <TableCell className="text-[#666666] p-4"><Mail size={16} className="inline mr-2" />{msg.subject}</TableCell>
                <TableCell className="text-[#666666] p-4">{msg.time}</TableCell>
                <TableCell className="text-[#666666] p-4">{msg.read ? 'Read' : 'Unread'}</TableCell>
                <TableCell className="p-4">
                  <Button size="sm" className="bg-[#FFA500] text-white hover:bg-[#ff8c00]">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
