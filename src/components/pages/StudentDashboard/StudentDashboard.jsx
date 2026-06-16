import React from 'react';
import {
  BookOpen, Clock, ClipboardList, FileText,
  ArrowRight, GraduationCap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EnrolledCourseCard, StatCard } from '@/components/molecules';
import { useMyStudent, useMyStudentKpis } from '@/hooks';
import { useAuth } from '@/context';

export function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: student, isLoading } = useMyStudent();
  const { data: kpis } = useMyStudentKpis();

  const rawCourses = student?.enrolledCourses ?? [];

  // Map full populated course objects to what EnrolledCourseCard expects
  const enrolledCourses = rawCourses.map((c) => ({
    id:              c._id || c.id || c,
    title:           c.title        || 'Untitled Course',
    description:     c.description  || '',
    instructor:      c.lecturer?.user?.name || '—',
    duration:        c.duration     ?? null,
    fee:             c.fee          ?? 0,
    enrollmentCount: c.enrollmentCount ?? null,
  }));

  const stats = [
    {
      icon: BookOpen, label: 'Courses Enrolled',
      value: isLoading ? '0' : (kpis?.totalEnrolled ?? enrolledCourses.length).toString(),
    },
    {
      icon: Clock, label: 'Learning Hours',
      value: kpis ? `${kpis.totalLearningHours}h` : '0.00',
    },
    {
      icon: ClipboardList, label: 'Pending Assignments',
      value: kpis ? String(kpis.pendingAssignments) : '0',
    },
    {
      icon: FileText, label: 'Materials Available',
      value: kpis ? String(kpis.totalMaterials) : '0',
    },
  ];

  return (
    <div className="bg-gray-50/60 min-h-screen flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 lg:mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              My Learning Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, <span className="font-semibold text-gray-700">{user?.name || 'Student'}</span>. Keep learning and growing.
            </p>
          </div>
          <button
            onClick={() => navigate('/courses')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-primary to-primary-600 text-white rounded-xl text-sm font-semibold shadow-[0_4px_12px_rgba(255,165,0,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(255,165,0,0.4)] transition-all duration-300 cursor-pointer shrink-0"
          >
            <GraduationCap size={16} /> Browse Courses
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 lg:mb-10">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Enrolled Courses */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">My Courses</h2>
            {enrolledCourses.length > 0 && (
              <button
                onClick={() => navigate('/courses')}
                className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all duration-200 cursor-pointer bg-transparent border-none"
              >
                Explore more <ArrowRight size={14} />
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gray-100 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : enrolledCourses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-200" />
              </div>
              <p className="text-gray-600 font-semibold mb-1">No courses enrolled yet</p>
              <p className="text-sm text-gray-400 mb-4">Browse our catalogue and start your learning journey.</p>
              <button
                onClick={() => navigate('/courses')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-primary to-primary-600 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer border-none"
              >
                Browse Courses <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledCourses.map((course) => (
                <EnrolledCourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-center py-5 text-gray-500 text-xs mt-auto">
        <p>&copy; 2026 Wisdom Wave. Keep Learning!</p>
      </footer>
    </div>
  );
}
