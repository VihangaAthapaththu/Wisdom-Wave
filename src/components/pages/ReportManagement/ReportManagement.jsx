import React from 'react';
import { BarChart3, Users, BookOpen, TrendingUp, DollarSign, GraduationCap } from 'lucide-react';
import { Card } from '@/components';
import { PageHeader } from '@/components/molecules';
import { useAdminStats } from '@/hooks';

export function ReportManagement() {
  const { data: stats, isLoading } = useAdminStats();

  const statCards = [
    { icon: Users, label: 'Total Students', value: stats?.totalStudents ?? '—', color: 'from-blue-500 to-blue-600' },
    { icon: GraduationCap, label: 'Total Lecturers', value: stats?.totalLecturers ?? '—', color: 'from-violet-500 to-violet-600' },
    { icon: BookOpen, label: 'Published Courses', value: stats?.publishedCourses ?? '—', color: 'from-primary to-primary-600' },
    { icon: TrendingUp, label: 'Total Enrollments', value: stats?.totalEnrollments ?? '—', color: 'from-emerald-500 to-emerald-600' },
    { icon: DollarSign, label: 'Total Revenue', value: stats?.totalRevenue != null ? `$${Number(stats.totalRevenue).toLocaleString()}` : '—', color: 'from-amber-500 to-amber-600' },
  ];

  return (
    <div className="bg-bg-paper min-h-screen p-4 md:p-6 lg:p-10 flex flex-col">
      <PageHeader title="Reports &amp; Analytics" />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-muted">Loading stats...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {statCards.map((stat, i) => (
              <Card key={i} className="bg-white rounded-xl p-5 border border-border shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shrink-0`}>
                  <stat.icon size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider mb-0.5">{stat.label}</p>
                  <p className="text-2xl font-bold text-text-strong">{isLoading ? '—' : stat.value}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={18} className="text-primary" />
              <h2 className="font-semibold text-text-strong">Platform Overview</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted">
              <p>Enrollment rate: <span className="font-semibold text-text-strong">
                {stats?.totalStudents && stats.totalEnrollments
                  ? `${((stats.totalEnrollments / stats.totalStudents) * 100).toFixed(1)}%` : '—'}
              </span> avg enrollments per student</p>
              <p>Revenue per course: <span className="font-semibold text-text-strong">
                {stats?.publishedCourses && stats.totalRevenue
                  ? `$${(stats.totalRevenue / stats.publishedCourses).toFixed(2)}` : '—'}
              </span></p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
