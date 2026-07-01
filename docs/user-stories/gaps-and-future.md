# Gaps & Future / Out of Scope

## Out of scope (owner confirmed NOT needed)

These common LMS features were reviewed and intentionally excluded. They are recorded here only to document the decision — no stories are planned and no work should be done on them unless the owner revisits:

- **Quizzes / MCQ / auto-graded assessments** — no quiz/question model. Assignments (file submission + manual grading) cover assessment needs.
- **Certificates** — no certificate issuance / PDF generation.
- **Course reviews & ratings** — no rating model or star UI.

## Partial / potential future enhancements (existing areas)

These are working but limited; listed for future consideration, not built in this iteration:

- **Notifications coverage** — currently assignment/deadline focused. Could extend to enrollment, payment, and blog-moderation events. (`notifications.md`)
- **Reports & export** — summary stats exist; richer analytics, date ranges, and CSV/PDF export are future work. (`dashboards.md`)
- **Password reset** — the "Forgot password?" link is a placeholder; an email-based reset flow is not implemented. (`authentication.md`)
- **In-app media player** — course media is served by URL with no dedicated player/transcoding or streaming protection. (`materials-lessons.md`)
- **Contact inbox** — contact submissions are emailed only; a stored `ContactMessage` model + admin inbox could be added. (`contact.md`)

## Technical notes / follow-ups

- **Stripe LKR:** checkout uses `currency: "lkr"`. Live settlement in LKR depends on the Stripe account's country; verify before going live. Test mode is unaffected.
- **Bundle size:** the main client chunk is large (>800 kB). Consider route-level `manualChunks`/dynamic imports if load time becomes a concern.
- **Orphaned students:** fixed at runtime via `findOrCreateByUserId`; run `npm run backfill:students` once to repair any existing orphaned STUDENT accounts.
