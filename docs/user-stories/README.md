# Wisdom Wave LMS — User Stories

This folder documents the product as a set of user stories, one file per feature area. It reflects the current implementation plus the changes made in this iteration (currency → Rs/LKR, lecturer courses read-only, functional Contact form, Zod + backend validation, improved API error handling, and the enrollment self-heal fix).

## Roles

- **Guest** — unauthenticated visitor (landing, course catalog, blog, contact).
- **Student** — default role on self-registration; enrolls in courses, learns, submits assignments.
- **Lecturer** — created by an Admin; manages content (materials/assignments) on assigned courses. **Cannot create, edit, or delete courses.**
- **Admin** — full control: courses, students, lecturers, enrollments, payments, blog moderation, reports.

## Story format

```
### US-<area>-<n>: <title>
**As a** <role>, **I want** <goal>, **so that** <benefit>.
**Acceptance criteria:**
- ...
**Status:** Implemented | Partial | Missing | Out of scope
**Related:** <files / endpoints>
```

## Status legend

- **Implemented** — working in the codebase today.
- **Partial** — present but limited; notes describe the gap.
- **Missing** — not built.
- **Out of scope** — intentionally excluded (see `gaps-and-future.md`).

## Index

| Area | File |
|------|------|
| Authentication & accounts | [authentication.md](authentication.md) |
| Courses | [courses.md](courses.md) |
| Enrollment & payments | [enrollment-payments.md](enrollment-payments.md) |
| Materials & lessons | [materials-lessons.md](materials-lessons.md) |
| Assignments | [assignments.md](assignments.md) |
| Progress tracking | [progress-tracking.md](progress-tracking.md) |
| Blog | [blog.md](blog.md) |
| Messaging & chat | [messaging-chat.md](messaging-chat.md) |
| Notifications | [notifications.md](notifications.md) |
| Dashboards | [dashboards.md](dashboards.md) |
| Contact | [contact.md](contact.md) |
| Admin management | [admin-management.md](admin-management.md) |
| Cross-cutting: validation & errors | [validation-and-errors.md](validation-and-errors.md) |
| Gaps & future / out of scope | [gaps-and-future.md](gaps-and-future.md) |

## Conventions confirmed this iteration

- **Currency:** all fees/amounts display as `Rs …` (LKR). Stripe checkout uses `currency: "lkr"`. Helper: `Wisdom-Wave-frontend/src/lib/currency.js`.
- **Validation:** client-side via Zod (`src/lib/validation/`), server-side via `express-validator` (`src/validators/`).
- **Errors:** backend returns `{ status, statusCode, message, errors? }`; frontend surfaces the real message + status via `src/lib/api/errorUtils.js` and a global React Query error toast.
