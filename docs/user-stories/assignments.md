# Assignments

Covers creating assignments, student submissions, grading, and deadline reminders.

### US-ASG-1: Lecturer/Admin creates an assignment
**As a** Lecturer or Admin, **I want** to create an assignment with a title, description, and due date, **so that** students have graded work.
**Acceptance criteria:**
- `POST /api/courses/:id/assignments` creates an `Assignment` tied to the course.
- Creating an assignment notifies enrolled students (`ASSIGNMENT_PUBLISHED`).
**Status:** Implemented
**Related:** `assignment.controller.js`, `Assignment.model.js`, `CoursePage.jsx`

### US-ASG-2: Student submits an assignment
**As a** Student, **I want** to upload my submission, **so that** it can be graded.
**Acceptance criteria:**
- A `Submission` stores the file, submission time, and links to the assignment + student.
- Students can view and remove their own submission before grading.
**Status:** Implemented
**Related:** `Submission.model.js`, `useSubmitAssignment`, `useDeleteMySubmission`

### US-ASG-3: Lecturer/Admin grades a submission
**As a** Lecturer or Admin, **I want** to assign a grade and feedback, **so that** students get results.
**Acceptance criteria:** grade + feedback are saved on the submission and visible to the student.
**Status:** Implemented
**Related:** `useGradeSubmission`, `assignment.controller.js`

### US-ASG-4: Deadline reminders
**As a** Student, **I want** reminders as a due date approaches, **so that** I don't miss it.
**Acceptance criteria:** a scheduler emits `DEADLINE_APPROACHING` notifications and emails.
**Status:** Implemented
**Related:** `deadline.scheduler.js`, `emailTemplates.js`, `notification.controller.js`

### US-ASG-5: Auto-graded quizzes / MCQ
**As a** Lecturer, **I want** auto-graded quizzes, **so that** assessment scales.
**Status:** Out of scope (see `gaps-and-future.md`).
