# Messaging & Chat

Covers real-time one-to-one messaging between users.

### US-MSG-1: Real-time conversation
**As a** Student or Lecturer, **I want** to exchange messages in real time, **so that** I can get help quickly.
**Acceptance criteria:**
- Messages persist (`Conversation`, `Message` with `senderRole`) and stream over Socket.io.
- A chat widget is available across the client layout; a full message portal exists at `/messages`.
**Status:** Implemented
**Related:** `ChatWidget.jsx`, `MessagePortal.jsx`, `chat.controller.js`, `socket/socket.js`

### US-MSG-2: Read receipts
**As a** participant, **I want** to see when my messages are read, **so that** I know they landed.
**Acceptance criteria:** `isRead`/`readAt` are tracked and reflected in the UI.
**Status:** Implemented
**Related:** `Message.model.js`

### US-MSG-3: Message history
**As a** participant, **I want** past messages to load when I reopen a conversation, **so that** context is preserved.
**Status:** Implemented
**Related:** `chat.controller.js`
