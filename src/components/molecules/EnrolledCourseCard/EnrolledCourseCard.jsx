import React from 'react';
import { BookOpen, Clock, Users, ChevronRight, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function EnrolledCourseCard({ course }) {
  const navigate = useNavigate();
  const isFree = !course.fee || Number(course.fee) === 0;

  return (
    <div
      onClick={() => navigate(`/courses/${course.id}`)}
      className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/25 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-primary-600/10 flex items-center justify-center shrink-0 group-hover:from-primary/25 group-hover:to-primary-600/15 transition-colors duration-300">
          <BookOpen size={20} className="text-primary" />
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                {course.title}
              </h3>
              {course.instructor && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {course.instructor}
                </p>
              )}
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
          </div>

          {/* Description */}
          {course.description && (
            <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
              {course.description}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {course.duration != null && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={12} /> {course.duration}h
              </span>
            )}
            {course.enrollmentCount != null && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Users size={12} /> {course.enrollmentCount} students
              </span>
            )}
            {course.materialsCount != null && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <FileText size={12} /> {course.materialsCount} materials
              </span>
            )}
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
              isFree
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {isFree ? 'Free' : `$${course.fee}`}
            </span>
          </div>
        </div>
      </div>

      {/* Continue button */}
      <div className="mt-4 pt-3 border-t border-gray-50 flex justify-end">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-2.5 transition-all duration-200">
          Continue Learning <ChevronRight size={13} />
        </span>
      </div>
    </div>
  );
}
