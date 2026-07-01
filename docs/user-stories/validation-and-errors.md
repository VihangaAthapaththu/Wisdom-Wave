# Cross-cutting: Validation & Error Handling

These stories span every form and API call. Added/strengthened this iteration.

### US-VAL-1: Client-side form validation (Zod)
**As a** user, **I want** forms to catch mistakes before submitting, **so that** I get instant, clear feedback.
**Acceptance criteria:**
- Every form validates with a Zod schema on submit and shows inline field errors.
- Covered: sign in, sign up, contact, course create/edit, lecturer registration, admin manual-enroll (schemas in `src/lib/validation/schemas.js`).
- Helper `validateForm(schema, data)` returns `{ success, errors }` mapped to field messages.
**Status:** Implemented
**Related:** `src/lib/validation/validateForm.js`, `schemas.js`

### US-VAL-2: Server-side validation (express-validator)
**As the** system, **I want** every mutating endpoint to validate input, **so that** bad data never reaches the database.
**Acceptance criteria:**
- Validators exist for auth, course, lecturer, blog, **contact, payment, student, admin-enroll**.
- Failures return `400` with `{ errors: [{ field, message }] }`.
- Shared handler: `src/validators/validate.js`.
**Status:** Implemented
**Related:** `src/validators/*`, wired in the corresponding `routes/*`

### US-ERR-1: Users see the real error + status code
**As a** user, **I want** to see what actually went wrong (message + HTTP status), **so that** I can react or report it.
**Acceptance criteria:**
- Backend responses include `{ status, statusCode, message, errors? }`.
- Frontend `getApiError(error)` extracts status, message, and field errors (with a network-error fallback); `toastApiError` shows `"<message> (Error <status>)"`.
- A global React Query `onError` surfaces data-loading failures as toasts (401s skipped; opt-out via `meta.skipGlobalErrorToast`).
- Key flows (auth, enroll, payment, course, contact, admin) use these helpers.
**Status:** Implemented
**Related:** `src/lib/api/errorUtils.js`, `App.jsx` (QueryCache), `middlewares/errorHandler.js`
