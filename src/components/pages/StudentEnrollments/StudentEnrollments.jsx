import React from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components'
import { PageHeader } from '@/components/molecules';

export function StudentEnrollments() {
  const enrollments = [
    { id: 1, student: 'John Doe', course: 'React Fundamentals', date: '2026-01-15', progress: 65 },
    { id: 2, student: 'Jane Smith', course: 'Advanced JavaScript', date: '2026-01-18', progress: 45 },
    { id: 3, student: 'Bob Johnson', course: 'Web Design Basics', date: '2026-01-20', progress: 80 },
  ];

  return (
    <div className="bg-bg-paper min-h-screen p-4 md:p-6 lg:p-10 flex flex-col">
      <PageHeader title="Student Enrollments" />

      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-bg-surface border-b-2 border-primary">
            <TableRow>
              <TableHead className="font-bold text-text-strong p-4">Student</TableHead>
              <TableHead className="font-bold text-text-strong p-4">Course</TableHead>
              <TableHead className="font-bold text-text-strong p-4">Date</TableHead>
              <TableHead className="font-bold text-text-strong p-4">Progress</TableHead>
              <TableHead className="font-bold text-text-strong p-4">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollments.map((enrollment) => (
              <TableRow key={enrollment.id} className="hover:bg-bg-surface border-b border-border">
                <TableCell className="text-muted p-4">{enrollment.student}</TableCell>
                <TableCell className="text-muted p-4"><BookOpen size={16} className="inline mr-2" />{enrollment.course}</TableCell>
                <TableCell className="text-muted p-4">{enrollment.date}</TableCell>
                <TableCell className="text-muted p-4">{enrollment.progress}%</TableCell>
                <TableCell className="text-muted p-4"><CheckCircle size={16} className="inline text-success mr-2" />Active</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
