# Notifications

Covers in-app and email notifications.

### US-NOTIF-1: Assignment notifications
**As a** Student, **I want** to be notified when an assignment is published, updated, or due soon, **so that** I stay on track.
**Acceptance criteria:**
- Notification types: `ASSIGNMENT_PUBLISHED`, `ASSIGNMENT_UPDATED`, `DEADLINE_APPROACHING`.
- Delivered in-app (bell + notifications page) and by email.
**Status:** Implemented
**Related:** `Notification.model.js`, `notification.controller.js`, `deadline.scheduler.js`, `NotificationBell.jsx`, `Notification.jsx`

### US-NOTIF-2: Mark as read
**As a** user, **I want** to mark notifications read, **so that** I can track what's new.
**Status:** Implemented
**Related:** `notification.controller.js`, `NotificationBell.jsx`

### US-NOTIF-3: Broader notification coverage
**As a** user, **I want** notifications for enrollment, payment, and blog moderation events too, **so that** all key events reach me.
**Status:** Partial — notifications are currently assignment/deadline focused. See `gaps-and-future.md`.
