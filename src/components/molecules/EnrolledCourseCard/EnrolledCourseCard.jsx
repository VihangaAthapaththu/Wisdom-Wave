import React from 'react';
import { BookOpen, Clock, Users, ChevronRight, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STATUS_STYLES = {
  COMPLETED:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 border border-blue-200',
  NOT_STARTED: 'bg-gray-50 text-gray-500 border border-gray-200',
};

const STATUS_LABELS = {
  COMPLETED:   'Completed',
  IN_PROGRESS: 'In Progress',
  NOT_STARTED: 'Not Started',
};

export function EnrolledCourseCard({ course, progressData }) {
  const navigate = useNavigate();
  const isFree = !course.fee || Number(course.fee) === 0;

  const pct   = progressData?.progressPercentage ?? null;
  const status = progressData?.status ?? null;
  const completedMaterials = progressData?.completedMaterials ?? 0;
  const totalMaterials     = progressData?.totalMaterials ?? 0;

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

      {/* Progress bar (shown when progressData is available) */}
      {pct !== null && (
        <div className="mt-4 pt-3 border-t border-gray-50">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              {status === 'COMPLETED' && <CheckCircle2 size={13} className="text-emerald-500" />}
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[status] || STATUS_STYLES.NOT_STARTED}`}>
                {STATUS_LABELS[status] || 'Not Started'}
              </span>
            </div>
            <span className="text-xs font-bold text-primary">{pct}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          {totalMaterials > 0 && (
            <p className="text-xs text-gray-400 mt-1">{completedMaterials}/{totalMaterials} lessons done</p>
          )}
        </div>
      )}

      {/* Continue button */}
      <div className={`${pct !== null ? 'mt-3' : 'mt-4 pt-3 border-t border-gray-50'} flex justify-end`}>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-2.5 transition-all duration-200">
          {status === 'COMPLETED' ? 'Review Course' : 'Continue Learning'} <ChevronRight size={13} />
        </span>
      </div>
    </div>
  );
}
