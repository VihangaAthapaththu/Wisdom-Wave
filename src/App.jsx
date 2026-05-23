import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CourseManagement from './pages/CourseManagement';
import CourseMaterialManagement from './pages/CourseMaterialManagement';
import CourseList from './pages/CourseList';
import CoursePage from './pages/CoursePage';
import LessonPage from './pages/LessonPage';
import BlogManagement from './pages/BlogManagement';
import BlogStudent from './pages/BlogStudent';
import StudentManagement from './pages/StudentManagement';
import StudentEnrollments from './pages/StudentEnrollments';
import MessagePortal from './pages/MessagePortal';
import ReportManagement from './pages/ReportManagement';
import Notification from './pages/Notification';
import ClientNavbar from './components/Common/ClientNavbar';
import './App.css';

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
  return (
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
            <Route path="/dashboard/blog" element={<BlogManagement />} />
            <Route path="/dashboard/reports" element={<ReportManagement />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
