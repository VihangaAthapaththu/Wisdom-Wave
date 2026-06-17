import { io } from "socket.io-client";

// Singleton socket — connects using the same cookie the REST API uses.
//
// transports: ['websocket'] — connect straight over WebSocket instead of the
// default HTTP long-polling → WebSocket upgrade. The dev frontend (localhost:5173)
// and backend (localhost:8000) are the SAME SITE (SameSite is domain-, not
// port-based), so the httpOnly `lax` auth cookie is sent on the WS handshake too.
// Skipping the upgrade eliminates the "WebSocket closed before connection
// established" race and the stale `transport=polling` 400s after a dev restart.
const socket = io(import.meta.env.VITE_API_BASE_URL || "http://localhost:8000", {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

export default socket;
