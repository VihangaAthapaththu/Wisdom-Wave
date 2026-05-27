import React from 'react';
import { Users } from 'lucide-react';
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import { PageHeader } from '@/components/molecules';

export function StudentManagement() {
  const students = [
    { id: 1, name: 'John Doe', email: 'john@example.com', courses: 5, status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', courses: 3, status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', courses: 2, status: 'Inactive' },
  ];

  return (
    <div className="bg-[#faf8f5] min-h-screen p-4 md:p-6 lg:p-10 flex flex-col">
      <PageHeader title="Student Management" buttonText="Add Student" />

      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-[#f5f5f5] border-b-2 border-[#FFA500]">
            <TableRow>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Name</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Email</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Courses</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Status</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id} className="hover:bg-[#f5f5f5] border-b border-[#e0e0e0]">
                <TableCell className="text-[#666666] p-4"><Users size={16} className="inline mr-2" />{student.name}</TableCell>
                <TableCell className="text-[#666666] p-4">{student.email}</TableCell>
                <TableCell className="text-[#666666] p-4">{student.courses}</TableCell>
                <TableCell className="text-[#666666] p-4">{student.status}</TableCell>
                <TableCell className="p-4">
                  <Button size="sm" className="bg-[#FFA500] text-white hover:bg-[#ff8c00] mr-2">Edit</Button>
                  <Button size="sm" variant="destructive">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
