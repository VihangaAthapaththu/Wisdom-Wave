# Blog

Covers authoring, moderation, and reading of blog articles. Blog statuses are **uppercase**: `DRAFT`, `PENDING`, `PUBLISHED`, `REJECTED`.

### US-BLOG-1: Author writes an article
**As a** Student, Lecturer, or Admin, **I want** to write an article in a rich-text editor with a featured image, **so that** I can share knowledge.
**Acceptance criteria:**
- Tiptap editor with image upload (Cloudinary); read time auto-computed.
- Title (3–200) and content required — validated (Zod `blogSchema` + server).
- Saving as draft sets status `DRAFT`; submitting sets `PENDING`.
**Status:** Implemented
**Related:** `BlogEditor.jsx`, `blogSchema`, `blog.controller.js`, `Blog.model.js`

### US-BLOG-2: Admin moderates articles
**As an** Admin, **I want** to review pending articles and publish or reject them with a note, **so that** quality is controlled.
**Acceptance criteria:**
- Status transitions `PENDING → PUBLISHED` (sets `publishedAt`) or `PENDING → REJECTED` (stores `moderationNote`).
- Status comparisons are case-insensitive where filtered in the UI.
**Status:** Implemented
**Related:** `BlogManagement.jsx`, `blogStatus.js`

### US-BLOG-3: Reader reads published articles
**As a** Guest or Student, **I want** to browse and read published articles by slug, **so that** I can learn outside courses.
**Acceptance criteria:** only `PUBLISHED` posts are public; view counts increment.
**Status:** Implemented
**Related:** `BlogStudent.jsx`, `BlogDetail.jsx`

### US-BLOG-4: Author dashboard
**As an** author, **I want** to see my drafts/pending/published/rejected posts, **so that** I can manage my writing.
**Status:** Implemented
**Related:** `BlogDashboard.jsx`

### US-BLOG-5: Blog templates & categories
**As an** Admin, **I want** templates and categories, **so that** posts are consistent and organised.
**Status:** Implemented
**Related:** `TemplateManagement.jsx`, `BlogTemplate`/`BlogCategory` models
