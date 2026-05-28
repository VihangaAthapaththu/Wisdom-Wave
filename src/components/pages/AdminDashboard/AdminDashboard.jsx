import React from 'react';
import { Users, BookOpen, FileText, BarChart3, Settings, LogOut, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/context";
import { StatCard, MenuCard } from '@/components/molecules';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const stats = [
    { icon: Users, label: 'Total Students', value: '1,234' },
    { icon: BookOpen, label: 'Active Courses', value: '28' },
    { icon: FileText, label: 'Course Materials', value: '156' },
    { icon: BarChart3, label: 'Enrollments', value: '5,678' },
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 flex-1 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 lg:mb-10 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.name || 'Administrator'}</p>
          </div>
          <div className="flex gap-2 items-center">
            <button className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-500 flex items-center justify-center hover:border-[#FFA500]/50 hover:text-[#FFA500] transition-colors cursor-pointer">
              <Settings size={18} />
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#FFA500] to-[#ff8c00] text-white rounded-xl font-medium text-sm shadow-md shadow-[#FFA500]/15 hover:shadow-lg hover:shadow-[#FFA500]/25 transition-all cursor-pointer active:scale-[0.97]"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8 lg:mb-10">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Management */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Management</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MenuCard href="/dashboard/courses" icon={BookOpen} title="Course Management" description="Manage courses and content" />
            <MenuCard href="/dashboard/students" icon={Users} title="Student Management" description="Manage student accounts" />
            <MenuCard href="/dashboard/lecturers" icon={GraduationCap} title="Lecturer Management" description="Register and manage lecturers" />
            <MenuCard href="/dashboard/students/enrollments" icon={FileText} title="Enrollments" description="Track student enrollments" />
            <MenuCard href="/dashboard/blog" icon={FileText} title="Blog Management" description="Create and manage blog posts" />
            <MenuCard href="/dashboard/reports" icon={BarChart3} title="Reports" description="View analytics and reports" />
            <MenuCard href="/dashboard/courses/1/materials" icon={BookOpen} title="Course Materials" description="Manage course materials" />
          </div>
        </div>
      </div>

      <footer className="bg-gray-950 text-center py-5 text-gray-600 text-xs mt-auto">
        <p>&copy; 2026 Wisdom Wave Admin Panel. All rights reserved.</p>
      </footer>
    </div>
  );
}
