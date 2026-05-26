import React, { useState, useEffect } from 'react';
import { BookOpen, Users, FileText, CheckSquare, Settings, LogOut, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { StatCard, MenuCard } from '@/components/molecules';
import lecturerService from '@/services/lecturerService';

export function LecturerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await lecturerService.getMyProfile();
      setProfile(response.data.lecturer);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const stats = [
    { icon: BookOpen, label: 'My Courses', value: '4' },
    { icon: Users, label: 'Enrolled Students', value: '342' },
    { icon: FileText, label: 'Materials Uploaded', value: '28' },
    { icon: CheckSquare, label: 'Assignments Graded', value: '156' },
  ];

  if (isLoading) {
    return (
      <div className="bg-[#faf8f5] min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#FFA500] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#faf8f5] min-h-screen p-4 md:p-6 lg:p-10 flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-[30px] lg:mb-[50px] flex-wrap gap-5">
        <div>
          <h1 className="text-[22px] md:text-[28px] lg:text-[40px] font-bold text-[#1a1a1a] mb-2.5 bg-gradient-to-br from-[#FFA500] to-[#ff8c00] bg-clip-text text-transparent m-0">Lecturer Dashboard</h1>
          <p className="text-base text-[#666666] m-0">
            Welcome back, {user?.name || 'Lecturer'}
            {profile?.specialization && <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFA500]/10 text-[#FFA500] border border-[#FFA500]/20">{profile.specialization}</span>}
          </p>
        </div>
        <div className="flex gap-[15px] items-center w-full md:w-auto">
          <button className="w-11 h-11 rounded-[10px] bg-white border-2 border-[#e0e0e0] text-[#1a1a1a] flex items-center justify-center transition-all duration-300 hover:border-[#FFA500] hover:text-[#FFA500] cursor-pointer">
            <Settings size={20} />
          </button>
          <button 
            className="px-5 py-2.5 bg-gradient-to-br from-[#FFA500] to-[#ff8c00] text-white border-none rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_12px_rgba(255,165,0,0.3)] hover:-translate-y-[2px] hover:shadow-[0_6px_16px_rgba(255,165,0,0.4)] w-11 md:w-auto p-2.5 md:py-2.5 md:px-5 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-[30px] lg:mb-[50px]">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Menu Grid */}
      <div className="mb-[50px]">
        <h2 className="text-[20px] md:text-[24px] font-bold text-[#1a1a1a] m-0 mb-5 lg:mb-[30px]">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <MenuCard 
            href="/lecturer-dashboard/courses" 
            icon={BookOpen} 
            title="My Courses" 
            description="Manage your assigned courses" 
          />
          <MenuCard 
            href="/lecturer-dashboard/courses/1/materials" 
            icon={FileText} 
            title="Course Materials" 
            description="Upload and manage study materials" 
          />
          <MenuCard 
            href="/lecturer-dashboard/blog" 
            icon={FileText} 
            title="Blog Contributions" 
            description="Write and publish educational articles" 
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white text-center p-6 rounded-lg text-sm mt-auto">
        <p className="m-0">&copy; 2026 Wisdom Wave Lecturer Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}
