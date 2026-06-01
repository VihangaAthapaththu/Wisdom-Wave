import React from 'react';
import { BookOpen, Clock, Award, TrendingUp } from 'lucide-react';
import { StatCard, EnrolledCourseCard } from '@/components/molecules';
import { useMyStudent } from '@/hooks';
import { useAuth } from '@/context';

export function StudentDashboard() {
  const { user } = useAuth();
  const { data: student, isLoading } = useMyStudent();

  const enrolledCourses = student?.enrolledCourses ?? [];

  const stats = [
    { icon: BookOpen, label: 'Courses Enrolled', value: isLoading ? '—' : enrolledCourses.length.toString() },
    { icon: TrendingUp, label: 'Learning Hours', value: '—' },
    { icon: Award, label: 'Certifications', value: '—' },
    { icon: Clock, label: 'Current Streak', value: '—' },
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 flex-1 w-full">
        {/* Header */}
        <div className="mb-8 lg:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">My Learning Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, {user?.name || 'Student'}. Keep learning and growing.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8 lg:mb-10">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Enrolled Courses */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My Courses</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400">
              Loading courses...
            </div>
          ) : enrolledCourses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 font-medium">No courses enrolled yet.</p>
              <a href="/courses" className="text-primary text-sm hover:underline mt-1 inline-block">Browse courses</a>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {enrolledCourses.map((course) => (
                <EnrolledCourseCard
                  key={course._id || course.id}
                  course={{
                    id: course._id || course.id,
                    title: course.title,
                    instructor: course.lecturer?.user?.name || '—',
                    startDate: course.createdAt ? new Date(course.createdAt).toLocaleDateString() : '—',
                    progress: 0,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="bg-gray-950 text-center py-5 text-gray-600 text-xs mt-auto">
        <p>&copy; 2026 Wisdom Wave. Keep Learning!</p>
      </footer>
    </div>
  );
}
