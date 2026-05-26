import React from 'react';
import { BookOpen, Clock, Award, TrendingUp } from 'lucide-react';
import { StatCard, EnrolledCourseCard } from '@/components/molecules';

export function StudentDashboard() {
  const stats = [
    { icon: BookOpen, label: 'Courses Enrolled', value: '8' },
    { icon: TrendingUp, label: 'Learning Hours', value: '156' },
    { icon: Award, label: 'Certifications', value: '3' },
    { icon: Clock, label: 'Current Streak', value: '12 days' },
  ];

  const enrolledCourses = [
    { id: 1, title: 'React Fundamentals', progress: 65, instructor: 'John Smith', startDate: 'Jan 15, 2026' },
    { id: 2, title: 'Advanced JavaScript', progress: 45, instructor: 'Jane Doe', startDate: 'Jan 20, 2026' },
    { id: 3, title: 'Web Design Basics', progress: 80, instructor: 'Mike Johnson', startDate: 'Dec 10, 2025' },
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 flex-1 w-full">
        {/* Header */}
        <div className="mb-8 lg:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">My Learning Dashboard</h1>
          <p className="text-sm text-gray-500">Keep learning and growing</p>
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
          <div className="flex flex-col gap-4">
            {enrolledCourses.map((course) => (
              <EnrolledCourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-gray-950 text-center py-5 text-gray-600 text-xs mt-auto">
        <p>&copy; 2026 Wisdom Wave. Keep Learning!</p>
      </footer>
    </div>
  );
}
