import React from 'react';
import { BookOpen, CheckCircle, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components';
import { PageHeader } from '@/components/molecules';
import { useStudents } from '@/hooks';

export function StudentEnrollments() {
  const { data: students = [], isLoading } = useStudents();

  // Flatten: one row per (student, enrolledCourse) pair
  const rows = students.flatMap((student) =>
    (student.enrolledCourses ?? []).map((course) => ({
      studentId: student._id,
      studentName: student.user?.name || '—',
      courseId: course._id || course,
      courseTitle: course.title || '—',
      enrolledAt: student.updatedAt || student.createdAt,
    }))
  );

  return (
    <div className="bg-bg-paper min-h-screen p-4 md:p-6 lg:p-10 flex flex-col">
      <PageHeader title="Student Enrollments" />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="bg-bg-surface border-b-2 border-primary">
              <TableRow>
                <TableHead className="font-bold text-text-strong p-4">Student</TableHead>
                <TableHead className="font-bold text-text-strong p-4">Course</TableHead>
                <TableHead className="font-bold text-text-strong p-4">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted py-12">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-border" />
                    <p className="font-medium">No enrollments yet.</p>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, idx) => (
                  <TableRow key={`${row.studentId}-${row.courseId}-${idx}`} className="hover:bg-bg-surface border-b border-border">
                    <TableCell className="text-muted p-4">{row.studentName}</TableCell>
                    <TableCell className="text-muted p-4">
                      <BookOpen size={16} className="inline mr-2" />
                      {row.courseTitle}
                    </TableCell>
                    <TableCell className="text-muted p-4">
                      <CheckCircle size={16} className="inline text-success mr-2" />
                      Active
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
