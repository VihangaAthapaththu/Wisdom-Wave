import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context";
import {
  ProtectedRoute,
  LandingPage,
  SignIn,
  SignUp,
  Contact,
  AdminDashboard,
  StudentDashboard,
  CourseManagement,
  CourseMaterialManagement,
  CourseList,
  CoursePage,
  LessonPage,
  BlogManagement,
  BlogStudent,
  StudentManagement,
  StudentEnrollments,
  MessagePortal,
  ReportManagement,
  Notification,
  LecturerDashboard,
  LecturerManagement,
  ClientNavbar,
} from "@/components";
import "./App.css";
import { Toaster } from "sonner";
import "sonner/dist/styles.css";

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

            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route element={<ClientLayout />}>
              <Route path="/contact" element={<Contact />} />
              <Route path="/courses" element={<CourseList />} />
              <Route path="/courses/:id" element={<CoursePage />} />
              <Route path="/blog" element={<BlogStudent />} />
            </Route>

            {/* Protected student routes with client navbar */}
            <Route element={<ProtectedRoute roles={["STUDENT", "ADMIN"]} />}>
              <Route element={<ClientLayout />}>
                <Route
                  path="/student-dashboard"
                  element={<StudentDashboard />}
                />
                <Route path="/lessons/:id" element={<LessonPage />} />
                <Route path="/messages" element={<MessagePortal />} />
                <Route path="/notifications" element={<Notification />} />
              </Route>
            </Route>

            {/* Protected admin routes */}
            <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/dashboard/courses" element={<CourseManagement />} />
              <Route
                path="/dashboard/courses/:id/materials"
                element={<CourseMaterialManagement />}
              />
              <Route
                path="/dashboard/students"
                element={<StudentManagement />}
              />
              <Route
                path="/dashboard/students/enrollments"
                element={<StudentEnrollments />}
              />
              <Route
                path="/dashboard/lecturers"
                element={<LecturerManagement />}
              />
              <Route path="/dashboard/blog" element={<BlogManagement />} />
              <Route path="/dashboard/reports" element={<ReportManagement />} />
            </Route>

            {/* Protected Lecturer routes */}
            <Route element={<ProtectedRoute roles={["LECTURER"]} />}>
              <Route
                path="/lecturer-dashboard"
                element={<LecturerDashboard />}
              />
              <Route
                path="/lecturer-dashboard/courses"
                element={<CourseManagement />}
              />
              <Route
                path="/lecturer-dashboard/courses/:id/materials"
                element={<CourseMaterialManagement />}
              />
              <Route
                path="/lecturer-dashboard/blog"
                element={<BlogManagement />}
              />
            </Route>
          </Routes>
          <Toaster position="bottom-right" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
