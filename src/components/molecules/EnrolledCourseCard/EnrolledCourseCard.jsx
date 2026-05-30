import React from 'react';
import { Card, Progress } from '@/components';
import { BookOpen } from 'lucide-react';

export function EnrolledCourseCard({ course }) {
  return (
    <Card className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md hover:shadow-[rgba(255,165,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 rounded-2xl">
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary-600/10 flex items-center justify-center shrink-0">
          <BookOpen size={18} className="text-primary" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-900 mb-1">{course.title}</h3>
          <p className="text-xs text-gray-500 mb-0.5">Instructor: {course.instructor}</p>
          <p className="text-xs text-gray-400">Started: {course.startDate}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:w-48 lg:w-64">
        <Progress value={course.progress} className="h-2 flex-1 bg-gray-100 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-primary-600 [&>div]:rounded-full" />
        <span className="font-bold text-primary text-sm min-w-[42px] text-right">{course.progress}%</span>
      </div>
    </Card>
  );
}
