import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context";
import { ProtectedRoute } from "@/components";
import { ClientNavbar } from "@/components";
import { PageLoader } from "@/components";

// Code-split all pages — only load the bundle when the route is visited
const LandingPage        = lazy(() => import("@/components/pages/LandingPage").then(m => ({ default: m.LandingPage })));
const SignIn             = lazy(() => import("@/components/pages/SignIn").then(m => ({ default: m.SignIn })));
const SignUp             = lazy(() => import("@/components/pages/SignUp").then(m => ({ default: m.SignUp })));
const Contact            = lazy(() => import("@/components/pages/Contact").then(m => ({ default: m.Contact })));
const AdminDashboard     = lazy(() => import("@/components/pages/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const StudentDashboard   = lazy(() => import("@/components/pages/StudentDashboard").then(m => ({ default: m.StudentDashboard })));
const CourseManagement   = lazy(() => import("@/components/pages/CourseManagement").then(m => ({ default: m.CourseManagement })));
const PaymentManagement  = lazy(() => import("@/components/pages/PaymentManagement/PaymentManagement").then(m => ({ default: m.PaymentManagement })));
const CourseList         = lazy(() => import("@/components/pages/CourseList").then(m => ({ default: m.CourseList })));
const CoursePage         = lazy(() => import("@/components/pages/CoursePage").then(m => ({ default: m.CoursePage })));
const LessonPage         = lazy(() => import("@/components/pages/LessonPage").then(m => ({ default: m.LessonPage })));
const PaymentSuccess     = lazy(() => import("@/components/pages/PaymentSuccess/PaymentSuccess").then(m => ({ default: m.PaymentSuccess })));
const PaymentCancel      = lazy(() => import("@/components/pages/PaymentCancel/PaymentCancel").then(m => ({ default: m.PaymentCancel })));
const BlogManagement     = lazy(() => import("@/components/pages/BlogManagement").then(m => ({ default: m.BlogManagement })));
const BlogStudent        = lazy(() => import("@/components/pages/BlogStudent").then(m => ({ default: m.BlogStudent })));
const StudentManagement  = lazy(() => import("@/components/pages/StudentManagement").then(m => ({ default: m.StudentManagement })));
const StudentEnrollments = lazy(() => import("@/components/pages/StudentEnrollments").then(m => ({ default: m.StudentEnrollments })));
const MessagePortal      = lazy(() => import("@/components/pages/MessagePortal").then(m => ({ default: m.MessagePortal })));
const ReportManagement   = lazy(() => import("@/components/pages/ReportManagement").then(m => ({ default: m.ReportManagement })));
const Notification       = lazy(() => import("@/components/pages/Notification").then(m => ({ default: m.Notification })));
const LecturerDashboard  = lazy(() => import("@/components/pages/LecturerDashboard").then(m => ({ default: m.LecturerDashboard })));
const LecturerManagement = lazy(() => import("@/components/pages/LecturerManagement").then(m => ({ default: m.LecturerManagement })));
const BlogDetail         = lazy(() => import("@/components/pages/BlogDetail/BlogDetail").then(m => ({ default: m.BlogDetail })));
const BlogEditor         = lazy(() => import("@/components/pages/BlogEditor/BlogEditor").then(m => ({ default: m.BlogEditor })));
const BlogDashboard      = lazy(() => import("@/components/pages/BlogDashboard/BlogDashboard").then(m => ({ default: m.BlogDashboard })));
const TemplateManagement = lazy(() => import("@/components/pages/TemplateManagement/TemplateManagement").then(m => ({ default: m.TemplateManagement })));

import "./App.css";
import { Toaster } from "sonner";
import "sonner/dist/styles.css";

// Instantiated outside App() to prevent recreation on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Suspense fallback={<PageLoader size={300} fullScreen={true} />}>
            <Routes>
              {/* Public routes */}
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route element={<ClientLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/courses" element={<CourseList />} />
                <Route path="/courses/:id" element={<CoursePage />} />
                <Route path="/payments/success" element={<PaymentSuccess />} />
                <Route path="/payments/cancel" element={<PaymentCancel />} />
                <Route path="/blog" element={<BlogStudent />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
              </Route>

              {/* Blog author routes — STUDENT, LECTURER, and ADMIN can write */}
              <Route element={<ProtectedRoute roles={["STUDENT", "LECTURER", "ADMIN"]} />}>
                <Route element={<ClientLayout />}>
                  <Route path="/blog/new" element={<BlogEditor />} />
                  <Route path="/blog/:id/edit" element={<BlogEditor />} />
                </Route>
              </Route>

              {/* Protected student routes */}
              <Route element={<ProtectedRoute roles={["STUDENT", "ADMIN"]} />}>
                <Route element={<ClientLayout />}>
                  <Route path="/student-dashboard" element={<StudentDashboard />} />
                  <Route path="/student-dashboard/blog" element={<BlogDashboard />} />
                  <Route path="/lessons/:id" element={<LessonPage />} />
                  <Route path="/messages" element={<MessagePortal />} />
                  <Route path="/notifications" element={<Notification />} />
                </Route>
              </Route>

              {/* Protected admin routes */}
              <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/dashboard/courses" element={<CourseManagement />} />
                <Route path="/dashboard/students" element={<StudentManagement />} />
                <Route path="/dashboard/students/enrollments" element={<StudentEnrollments />} />
                <Route path="/dashboard/lecturers" element={<LecturerManagement />} />
                <Route path="/dashboard/payments" element={<PaymentManagement />} />
                <Route path="/dashboard/blog" element={<BlogManagement />} />
                <Route path="/dashboard/templates" element={<TemplateManagement />} />
                <Route path="/dashboard/reports" element={<ReportManagement />} />
              </Route>

              {/* Protected lecturer routes */}
              <Route element={<ProtectedRoute roles={["LECTURER"]} />}>
                <Route path="/lecturer-dashboard" element={<LecturerDashboard />} />
                <Route path="/lecturer-dashboard/courses" element={<CourseManagement />} />
                <Route path="/lecturer-dashboard/blog" element={<BlogDashboard />} />
              </Route>
            </Routes>
          </Suspense>
          <Toaster position="bottom-right" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
