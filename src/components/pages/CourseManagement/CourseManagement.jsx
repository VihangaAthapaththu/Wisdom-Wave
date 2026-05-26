import React from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PageHeader } from '@/components/molecules';

export function CourseManagement() {
  const courses = [
    { id: 1, title: 'React Fundamentals', instructor: 'John Smith', students: 234, lessons: 12 },
    { id: 2, title: 'Advanced JavaScript', instructor: 'Jane Doe', students: 156, lessons: 18 },
    { id: 3, title: 'Web Design Basics', instructor: 'Mike Johnson', students: 342, lessons: 8 },
    { id: 4, title: 'Python for Beginners', instructor: 'Sarah Wilson', students: 89, lessons: 15 },
  ];

  return (
    <div className="bg-[#faf8f5] min-h-screen p-4 md:p-6 lg:p-10 flex flex-col">
      <PageHeader title="Course Management" buttonText="Add Course" />

      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-[#f5f5f5] border-b-2 border-[#FFA500]">
            <TableRow>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Course Title</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Instructor</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Students</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Lessons</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id} className="hover:bg-[#f5f5f5] border-b border-[#e0e0e0]">
                <TableCell className="text-[#666666] p-4"><BookOpen size={16} className="inline mr-2" />{course.title}</TableCell>
                <TableCell className="text-[#666666] p-4">{course.instructor}</TableCell>
                <TableCell className="text-[#666666] p-4">{course.students}</TableCell>
                <TableCell className="text-[#666666] p-4">{course.lessons}</TableCell>
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
