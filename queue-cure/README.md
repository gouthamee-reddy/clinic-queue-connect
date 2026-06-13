# Queue Cure

A real-time clinic token queue system. Single Node.js service serving an Express + Socket.io backend and two static HTML pages (Receptionist + Display).

## Stack
- **Backend:** Node.js, Express, Socket.io
- **Frontend:** Plain HTML/CSS/JS, served as static files
- **Storage:** In-memory (no database)

## Setup
```bash
npm install
npm start
```
Server runs on `http://localhost:3000` (or `process.env.PORT`).

- Receptionist: `http://localhost:3000/receptionist.html`
- Public display: `http://localhost:3000/display.html`

## Architecture
```
┌───────────────┐   socket.io   ┌──────────────────────┐
│ Receptionist  │ ◄───────────► │                      │
│ (browser)     │               │  Express + Socket.io │
└───────────────┘               │     server.js        │
┌───────────────┐               │  in-memory state     │
│  Display      │ ◄───────────► │                      │
│  (browser)    │               └──────────────────────┘
└───────────────┘
```

A single in-memory state object is the source of truth:
```js
{ tokens: [{ number, name, status }], currentToken, avgConsultTime, nextTokenNumber }
```
Every mutation broadcasts the full state via the `queue_updated` event so clients never need to merge diffs.

## Deployment on Render
1. Push this folder to a Git repo.
2. On Render, create a new **Web Service** from the repo.
3. Build command: `npm install`
4. Start command: `npm start`
5. Render injects `PORT` automatically — the server reads it.

The same setup works on Railway, Fly, or any Node host: one process, one port, WebSockets enabled by default.

## Socket Event Diagram
See `SOCKET_EVENTS.md`.

## Design Notes
See `THOUGHT_PROCESS.md`.
