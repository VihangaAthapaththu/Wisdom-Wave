# Courses

Covers course catalog, detail pages, and course lifecycle management.

### US-COURSE-1: Browse published courses
**As a** Guest or Student, **I want** to browse the catalog of published courses, **so that** I can find something to learn.
**Acceptance criteria:**
- `GET /api/courses` returns only published courses.
- Each card shows title, duration, and fee as `Rs …` (or "Free").
**Status:** Implemented
**Related:** `CourseList.jsx`, `CourseCard.jsx`, `course.controller.getAllPublishedCourses`

### US-COURSE-2: View course details
**As a** Guest or Student, **I want** to open a course page, **so that** I can see its description, duration, fee, materials, and assignments before enrolling.
**Acceptance criteria:**
- `GET /api/courses/:id` returns the course with lecturer info and enrollment count.
- Fee is shown as `Rs …`; free courses show "Free".
**Status:** Implemented
**Related:** `CoursePage.jsx`, `course.controller.getCourseById`

### US-COURSE-3: Admin creates a course
**As an** Admin, **I want** to create a course with title, description, duration, fee (LKR), assigned lecturer, and publish state, **so that** it appears in the catalog.
**Acceptance criteria:**
- Only Admin can `POST /api/courses` (others get `403`).
- Title (3–200) required; fee/duration must be ≥ 0 — validated client (Zod) and server (`express-validator`).
- Fee is labelled **Fee (LKR)**.
**Status:** Implemented
**Related:** `CourseManagement.jsx`, `CourseForm.jsx`, `courseSchema`, `course.validator.js`

### US-COURSE-4: Admin edits / deletes a course
**As an** Admin, **I want** to edit or delete any course, **so that** I can keep the catalog accurate.
**Acceptance criteria:**
- `PUT`/`DELETE /api/courses/:id` restricted to Admin.
- Delete asks for confirmation.
**Status:** Implemented
**Related:** `CourseManagement.jsx`, `course.routes.js`

### US-COURSE-5: Lecturer views assigned courses (read-only)
**As a** Lecturer, **I want** to view the courses assigned to me, **so that** I can manage their materials and assignments — **without** creating, editing, or deleting the courses themselves.
**Acceptance criteria:**
- Lecturer course page shows **View** only — no Add/Edit/Delete buttons.
- Backend rejects course create/update/delete by lecturers (`403`).
- Lecturers retain access to materials and assignments on their courses.
**Status:** Implemented (changed this iteration)
**Related:** `CourseManagement.jsx` (`isAdmin` gating), `course.routes.js`, `LecturerCoursesList.jsx`
