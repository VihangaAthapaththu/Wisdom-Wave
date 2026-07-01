# Authentication & Accounts

Covers registration, login, session handling, and role-based access.

### US-AUTH-1: Student self-registration
**As a** Guest, **I want** to create an account with my name, email, and password, **so that** I can enroll in courses.
**Acceptance criteria:**
- Sign-up validates name (3–50), a valid email, and a strong password (min 8, ≥1 uppercase, ≥1 number) plus a matching confirmation and accepted terms — client-side (Zod) and server-side.
- On success a `User` (role `STUDENT`) **and** a linked `Student` profile are created atomically.
- Duplicate emails are rejected with a clear `409` message.
**Status:** Implemented
**Related:** `SignUp.jsx`, `signUpSchema`, `auth.controller.js`, `auth.service.register`, `auth.validator.js`

### US-AUTH-2: Login
**As a** registered user, **I want** to log in with email and password, **so that** I can access my dashboard.
**Acceptance criteria:**
- Invalid credentials return `401` with a non-revealing message ("Invalid email or password").
- Deactivated accounts are blocked with `403`.
- On success a JWT is set as an httpOnly cookie and the user is routed to their role dashboard (Admin → `/dashboard`, Lecturer → `/lecturer-dashboard`, Student → `/student-dashboard`).
- Client validation (Zod) blocks empty/invalid submissions before the request.
**Status:** Implemented
**Related:** `SignIn.jsx`, `signInSchema`, `auth.service.login`, `authMiddleware.protect`

### US-AUTH-3: Session persistence & logout
**As a** logged-in user, **I want** my session to persist and to be able to log out, **so that** I stay signed in securely and can end my session.
**Acceptance criteria:**
- `GET /api/auth/me` returns the current user when the cookie is valid.
- Logout clears the auth cookie.
- Public pages that call `getMe` do not force a redirect on `401`.
**Status:** Implemented
**Related:** `authService.js`, `AuthContext`, `api.js` response interceptor

### US-AUTH-4: Role-based access control
**As the** system, **I want** to restrict routes and actions by role, **so that** users only access what they're permitted to.
**Acceptance criteria:**
- Frontend routes are wrapped in `ProtectedRoute roles={[...]}`.
- Backend routes use `protect` + `authorize(...roles)`; unauthorized access returns `403`.
**Status:** Implemented
**Related:** `ProtectedRoute.jsx`, `App.jsx`, `authMiddleware.authorize`

### US-AUTH-5: Password reset
**As a** user, **I want** to reset a forgotten password via email, **so that** I can regain access.
**Acceptance criteria:** email-based reset flow with expiring token.
**Status:** Missing (the "Forgot password?" link is a placeholder).
**Related:** `SignIn.jsx` (`#forgot`)
