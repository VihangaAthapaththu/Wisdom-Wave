# Enrollment & Payments

Covers free enrollment, paid enrollment via Stripe, admin manual enrollment, and payment administration. All amounts are in **Rs (LKR)**.

### US-ENROLL-1: Student enrolls in a free course
**As a** Student, **I want** to enroll in a free course in one click, **so that** I can start learning immediately.
**Acceptance criteria:**
- `POST /api/courses/:id/enroll` adds the course to the student's `enrolledCourses`.
- Enrolling again returns `409` ("Already enrolled").
- **Fix (this iteration):** if the logged-in student has no `Student` profile document (orphaned/legacy account), it is created on the fly so enrollment never fails with "Student profile not found".
**Status:** Implemented (bug fixed)
**Related:** `CourseCard.jsx`, `enrollment.service.enrollStudent`, `student.repository.findOrCreateByUserId`

### US-ENROLL-2: Student pays to enroll in a paid course
**As a** Student, **I want** to pay the course fee (in Rs) and be enrolled, **so that** I can access paid content.
**Acceptance criteria:**
- Paid courses cannot be enrolled directly (`402`); a `PENDING` payment is created via `POST /api/payments`.
- Card payments create a Stripe Checkout session with `currency: "lkr"` and redirect the student.
- On successful payment the student is enrolled (`enrollAfterPayment`).
- `createPayment` validates `courseId` (Mongo id) and `method` (enum) server-side.
**Status:** Implemented
**Related:** `CoursePage.jsx`, `payment.controller.js`, `payment.service.js`, `payment.validator.js`

### US-ENROLL-3: Student unenrolls
**As a** Student, **I want** to leave a course, **so that** it no longer appears in my list.
**Acceptance criteria:** `DELETE /api/courses/:id/unenroll` removes the course from `enrolledCourses`.
**Status:** Implemented
**Related:** `enrollment.service.unenrollStudent`

### US-ENROLL-4: Admin manually enrolls a student
**As an** Admin, **I want** to enroll any student into any course without payment, **so that** I can handle offline/manual cases.
**Acceptance criteria:**
- `POST /api/courses/:id/admin-enroll` takes a valid `studentId` (Mongo id, validated) and enrolls that `Student`.
- Invalid/missing id returns `400`; unknown student returns `404`.
- The dropdown sends the correct `Student._id`.
**Status:** Implemented
**Related:** `StudentEnrollments.jsx`, `adminEnrollSchema`, `enrollment.validator.js`, `enrollment.service.adminEnrollStudent`

### US-ENROLL-5: Admin views all enrollments
**As an** Admin, **I want** to see every student-course enrollment, **so that** I can audit access.
**Status:** Implemented
**Related:** `StudentEnrollments.jsx`

### US-PAY-1: Admin manages payments
**As an** Admin, **I want** to view payments and confirm/fail them, **so that** I can reconcile revenue.
**Acceptance criteria:**
- Payment list shows amounts and revenue in `Rs …`.
- Confirming a `PENDING` payment sets it `PAID` and enrolls the student.
**Status:** Implemented
**Related:** `PaymentManagement.jsx`, `payment.service.confirmPayment`

### US-PAY-2: Student views payment history
**As a** Student, **I want** to see my past payments, **so that** I have a record.
**Status:** Implemented
**Related:** `payment.service.getStudentPayments` (also self-heals missing student profile)
