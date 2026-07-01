# Progress Tracking

Covers per-student learning progress and analytics.

### US-PROG-1: Student sees course progress
**As a** Student, **I want** to see how far I've progressed in each course, **so that** I know what's left.
**Acceptance criteria:**
- Progress is computed from completed materials vs total (percentage).
- Shown as rings/bars on the student dashboard and progress page.
**Status:** Implemented
**Related:** `StudentDashboard.jsx`, `StudentProgress.jsx`, `LearningProgress.model.js`, `progress.service.js`

### US-PROG-2: Student sees learning insights
**As a** Student, **I want** insights (closest to completion, courses needing attention), **so that** I can prioritise.
**Status:** Implemented
**Related:** `StudentProgress.jsx`

### US-PROG-3: Admin/Lecturer views progress dashboard
**As an** Admin or Lecturer, **I want** to view aggregate learner progress, **so that** I can gauge engagement.
**Status:** Implemented
**Related:** `ProgressDashboard.jsx`, `progress.routes.js`

### US-PROG-4: Last-accessed tracking
**As the** system, **I want** to record when a student last accessed a course, **so that** "not opened in N days" insights work.
**Status:** Implemented
**Related:** `LearningProgress.model.js` (`lastAccessedAt`)
