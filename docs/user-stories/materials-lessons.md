# Materials & Lessons

Covers course content (files/media) upload, viewing, and completion.

### US-MAT-1: Lecturer/Admin uploads course material
**As a** Lecturer or Admin, **I want** to upload materials (PDF, video, image, audio, other) to a course, **so that** students have learning content.
**Acceptance criteria:**
- `POST /api/courses/:id/materials` accepts a file (multipart) and stores it in Cloudinary; a `CourseMaterial` record keeps `title`, `fileUrl`, `mimeType`.
- Restricted to Admin and the assigned Lecturer.
**Status:** Implemented
**Related:** `CoursePage.jsx`, `material.controller.js`, `CourseMaterial.model.js`, `config/cloudinary.js`

### US-MAT-2: Student views materials
**As a** Student, **I want** to open a course's materials, **so that** I can study.
**Acceptance criteria:** enrolled students can list and open materials on the course/lesson page.
**Status:** Implemented
**Related:** `CoursePage.jsx`, `LessonPage.jsx`, `material.controller.getMaterials`

### US-MAT-3: Student marks a material complete
**As a** Student, **I want** to mark materials complete, **so that** my progress is tracked.
**Acceptance criteria:** marking toggles completion and updates the course progress percentage.
**Status:** Implemented
**Related:** `useMarkMaterialComplete`, `LearningProgress.model.js`, `progress.service.js`

### US-MAT-4: Delete material
**As a** Lecturer or Admin, **I want** to remove a material, **so that** outdated content is cleaned up.
**Status:** Implemented
**Related:** `material.controller.deleteMaterial`

> Note: there is no dedicated in-app video player/transcoding — media is served via URL. See `gaps-and-future.md`.
