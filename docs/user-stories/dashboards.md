# Dashboards

Role-specific landing experiences.

### US-DASH-1: Admin dashboard
**As an** Admin, **I want** an overview of students, published courses, enrollments, and revenue (in Rs), **so that** I can run the platform.
**Acceptance criteria:**
- Stat cards show totals; Revenue is formatted as `Rs …`.
- Quick access to courses, students, enrollments, lecturers, payments, blog, templates, reports.
**Status:** Implemented
**Related:** `AdminDashboard.jsx`, `useAdminStats`

### US-DASH-2: Lecturer dashboard
**As a** Lecturer, **I want** to see my courses, students, and materials KPIs, **so that** I can manage my teaching.
**Acceptance criteria:** KPIs plus quick access to (read-only) courses and blog. No course-creation entry point.
**Status:** Implemented
**Related:** `LecturerDashboard.jsx`, `useMyLecturerKpis`

### US-DASH-3: Student dashboard
**As a** Student, **I want** to see my enrolled courses with progress and quick links, **so that** I can continue learning.
**Acceptance criteria:** enrolled courses with progress rings; links to progress, blog, enrollments.
**Status:** Implemented
**Related:** `StudentDashboard.jsx`, `EnrolledCourseCard.jsx`

### US-DASH-4: Reports
**As an** Admin, **I want** platform reports (revenue in Rs, enrollment rate, revenue/course), **so that** I can analyse performance.
**Status:** Partial — summary stats exist; deeper reporting/export is future work.
**Related:** `ReportManagement.jsx`
