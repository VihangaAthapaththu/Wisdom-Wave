# Admin Management

Covers admin-only management of students, lecturers, and platform data.

### US-ADM-1: Manage students
**As an** Admin, **I want** to register, list, and deactivate students, **so that** I control the learner base.
**Acceptance criteria:**
- `POST /api/students` creates a `User` (STUDENT) + `Student` profile atomically; name/email/password (+ optional phone/address) validated server-side.
- List and deactivate supported.
**Status:** Implemented
**Related:** `StudentManagement.jsx`, `student.controller.js`, `student.validator.js`

### US-ADM-2: Manage lecturers
**As an** Admin, **I want** to register and deactivate lecturers, **so that** I control who can teach.
**Acceptance criteria:**
- Registration validated client (Zod `lecturerSchema`) and server (`lecturer.validator.js`).
- Inline field errors, loading state, and real error+status on failure.
**Status:** Implemented
**Related:** `LecturerManagement.jsx`, `lecturer.validator.js`

### US-ADM-3: Manage enrollments
**As an** Admin, **I want** to view all enrollments and manually enroll students, **so that** I can administer access. (See [enrollment-payments.md](enrollment-payments.md).)
**Status:** Implemented
**Related:** `StudentEnrollments.jsx`

### US-ADM-4: Manage payments
**As an** Admin, **I want** to review and confirm/fail payments (amounts in Rs), **so that** I reconcile revenue. (See [enrollment-payments.md](enrollment-payments.md).)
**Status:** Implemented
**Related:** `PaymentManagement.jsx`

### US-ADM-5: Seeded admin
**As the** system, **I want** an initial admin account seeded on boot, **so that** the platform is usable from day one.
**Status:** Implemented
**Related:** `seeders/adminSeeder.js`
