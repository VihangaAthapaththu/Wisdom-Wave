import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/atoms';
import { LandingPage } from './components/pages/LandingPage';
import { SignIn } from './components/pages/SignIn';
import { SignUp } from './components/pages/SignUp';
import { Contact } from './components/pages/Contact';
import { AdminDashboard } from './components/pages/AdminDashboard';
import { StudentDashboard } from './components/pages/StudentDashboard';
import { CourseManagement } from './components/pages/CourseManagement';
import { CourseMaterialManagement } from './components/pages/CourseMaterialManagement';
import { CourseList } from './components/pages/CourseList';
import { CoursePage } from './components/pages/CoursePage';
import { LessonPage } from './components/pages/LessonPage';
import { BlogManagement } from './components/pages/BlogManagement';
import { BlogStudent } from './components/pages/BlogStudent';
import { StudentManagement } from './components/pages/StudentManagement';
import { StudentEnrollments } from './components/pages/StudentEnrollments';
import { MessagePortal } from './components/pages/MessagePortal';
import { ReportManagement } from './components/pages/ReportManagement';
import { Notification } from './components/pages/Notification';
import { LecturerDashboard } from './components/pages/LecturerDashboard';
import { LecturerManagement } from './components/pages/LecturerManagement';
import { ClientNavbar } from './components/organisms';
import './App.css';
import { Toaster } from 'sonner';
import 'sonner/dist/styles.css';

function ClientLayout() {
  return (
    <div className="client-layout">
      <ClientNavbar />
      <main className="client-main">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
        <Routes>
          {/* Public routes with client navbar */}
          <Route element={<ClientLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:id" element={<CoursePage />} />
            <Route path="/blog" element={<BlogStudent />} />
          </Route>

          {/* Protected student routes with client navbar */}
          <Route element={<ProtectedRoute roles={['STUDENT', 'ADMIN']} />}>
            <Route element={<ClientLayout />}>
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/lessons/:id" element={<LessonPage />} />
              <Route path="/messages" element={<MessagePortal />} />
              <Route path="/notifications" element={<Notification />} />
            </Route>
          </Route>

          {/* Protected admin routes */}
          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/dashboard/courses" element={<CourseManagement />} />
            <Route path="/dashboard/courses/:id/materials" element={<CourseMaterialManagement />} />
            <Route path="/dashboard/students" element={<StudentManagement />} />
            <Route path="/dashboard/students/enrollments" element={<StudentEnrollments />} />
            <Route path="/dashboard/lecturers" element={<LecturerManagement />} />
            <Route path="/dashboard/blog" element={<BlogManagement />} />
            <Route path="/dashboard/reports" element={<ReportManagement />} />
          </Route>

          {/* Protected Lecturer routes */}
          <Route element={<ProtectedRoute roles={['LECTURER']} />}>
            <Route path="/lecturer-dashboard" element={<LecturerDashboard />} />
            <Route path="/lecturer-dashboard/courses" element={<CourseManagement />} />
            <Route path="/lecturer-dashboard/courses/:id/materials" element={<CourseMaterialManagement />} />
            <Route path="/lecturer-dashboard/blog" element={<BlogManagement />} />
          </Route>
        </Routes>
        <Toaster position="bottom-right" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
