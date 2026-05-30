import React from 'react';
import { Clock, Users } from 'lucide-react';
import { Card, Button } from '@/components';

export function CourseCard({ course }) {
  const IconComp = course.icon;

  return (
    <div className="block h-full">
      <Card className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[rgba(255,165,0,0.05)] transition-all duration-300 flex flex-col relative overflow-hidden h-full hover:-translate-y-1.5">
        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          {course.level}
        </div>

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary-600/10 flex items-center justify-center mb-5 group-hover:from-primary/25 group-hover:to-primary-600/15 transition-colors duration-300">
          {typeof IconComp === 'function' ? (
            <IconComp size={26} className="text-primary" />
          ) : (
            IconComp
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">{course.title}</h3>
        <p className="text-sm text-gray-500 mb-5 leading-relaxed flex-grow">{course.description}</p>

        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-primary" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-primary" />
            <span>{typeof course.students === 'number' ? course.students.toLocaleString() : course.students}</span>
          </div>
        </div>

        <Button className="w-full bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary text-white py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-[rgba(255,165,0,0.15)] hover:shadow-lg hover:shadow-[rgba(255,165,0,0.25)] transition-all duration-300 h-auto active:scale-[0.97]">
          Enroll Now
        </Button>
      </Card>
    </div>
  );
}
