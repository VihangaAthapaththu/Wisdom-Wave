# Contact

Covers the public "Contact us" form.

### US-CONTACT-1: Visitor sends a message
**As a** Guest, **I want** to send a message via the contact form, **so that** I can reach the team.
**Acceptance criteria:**
- Fields: name, email, subject, message — validated client-side (Zod `contactSchema`) and server-side (`express-validator`), with inline field errors.
- `POST /api/contact` emails the submission to the admin (`CONTACT_EMAIL` or `EMAIL_USER`), with the sender set as `replyTo`.
- Success shows a toast and clears the form; failure shows the real error + status.
- The submit button shows a loading state and is disabled while sending.
**Status:** Implemented (was a non-functional stub before this iteration)
**Related:** `Contact.jsx`, `contactService.js`, `contact.controller.js`, `contact.validator.js`, `email.service.js`

### US-CONTACT-2: Configuration
**As an** operator, **I want** the contact target and SMTP to be configurable, **so that** messages are delivered.
**Acceptance criteria:**
- Env vars: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, and optional `CONTACT_EMAIL`.
- In development without SMTP credentials the send is a safe no-op (the endpoint still returns success); configure credentials to actually deliver.
**Status:** Implemented
**Related:** `email.service.js`

### US-CONTACT-3: Stored message inbox
**As an** Admin, **I want** an in-app inbox of contact messages, **so that** nothing is lost if email fails.
**Status:** Out of scope this iteration (owner chose email-only). Could be added later with a `ContactMessage` model + admin page.
