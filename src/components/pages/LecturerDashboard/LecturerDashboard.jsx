import React from "react";
import {
  BookOpen,
  Users,
  FileText,
  CheckSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context";
import {
  StatCard,
  MenuCard,
  PageLoader,
  LecturerCoursesList,
} from "@/components";
import { useMyLecturer, useMyLecturerKpis, useCourses } from "@/hooks";

export function LecturerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: courses = [], isLoading: isCoursesLoading } = useCourses(false);
  const { data: profileData, isLoading: isProfileLoading } = useMyLecturer();
  const { data: kpis } = useMyLecturerKpis();
  const profile =
    profileData?.data?.lecturer || profileData?.lecturer || profileData || null;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const stats = [
    { icon: BookOpen,    label: "My Courses",        value: kpis ? String(kpis.totalCourses)    : String(courses.length) },
    { icon: Users,       label: "Total Students",     value: kpis ? String(kpis.totalStudents)   : "—" },
    { icon: FileText,    label: "Materials Uploaded", value: kpis ? String(kpis.totalMaterials)  : "—" },
    { icon: CheckSquare, label: "Published Courses",  value: kpis ? String(kpis.publishedCourses): "—" },
  ];

  if (isProfileLoading || isCoursesLoading) {
    return (
      <div className="bg-bg-paper min-h-screen flex items-center justify-center">
        <PageLoader size={280} fullScreen={true} />
      </div>
    );
  }

  return (
    <div className="bg-bg-paper min-h-screen flex flex-col">
      {/* Main content */}
      <div className="flex-1 p-4 md:p-6 lg:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 lg:mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-br from-primary to-primary-600 bg-clip-text text-transparent leading-tight">
              Lecturer Dashboard
            </h1>
            <p className="text-sm text-muted mt-1.5 flex items-center flex-wrap gap-1.5">
              Welcome back, {user?.name || "Lecturer"}
              {profile?.specialization && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {profile.specialization}
                </span>
              )}
            </p>
          </div>

          <div className="flex gap-2.5 items-center shrink-0">
            <button className="w-10 h-10 rounded-xl bg-white border border-border text-text-strong flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-300 cursor-pointer shadow-sm">
              <Settings size={18} />
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-primary to-primary-600 text-white rounded-xl font-semibold shadow-[0_4px_12px_rgba(255,165,0,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(255,165,0,0.4)] transition-all duration-300 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span className="hidden sm:inline text-sm">Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 lg:mb-10">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Access + My Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Quick Access */}
          <div>
            <h2 className="text-lg md:text-xl font-bold text-text-strong mb-4 lg:mb-5">
              Quick Access
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MenuCard
                href="/lecturer-dashboard/courses"
                icon={BookOpen}
                title="My Courses"
                description="View your assigned courses & materials"
              />
              <MenuCard
                href="/lecturer-dashboard/blog"
                icon={FileText}
                title="Blog Contributions"
                description="Write and publish educational articles"
              />
            </div>
          </div>

          {/* My Courses */}
          <div>
            <h2 className="text-lg md:text-xl font-bold text-text-strong mb-4 lg:mb-5">
              My Courses
            </h2>
            <LecturerCoursesList courses={courses} />
          </div>
        </div>
      </div>

      {/* Footer — outside padded area so it spans full width with no gap */}
      <footer className="bg-black text-white text-center py-5 text-sm">
        <p className="m-0">
          &copy; 2026 Wisdom Wave Lecturer Portal. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
