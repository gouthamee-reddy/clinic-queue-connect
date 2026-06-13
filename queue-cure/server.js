const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => {
  res.redirect('/receptionist.html');
});

// ----- In-memory state -----
const state = {
  tokens: [],
  currentToken: null,
  avgConsultTime: 5,
  nextTokenNumber: 1,
};

// Lock to guard against rapid double "call_next" clicks
let callNextLock = false;

function broadcastState() {
  io.emit('queue_updated', state);
}

io.on('connection', (socket) => {
  // Send state immediately on connect
  socket.emit('queue_updated', state);

  socket.on('request_state', () => {
    socket.emit('queue_updated', state);
  });

  socket.on('add_patient', (payload) => {
    const name = (payload && typeof payload.name === 'string' ? payload.name : '').trim();
    if (!name) return;
    const token = {
      number: state.nextTokenNumber++,
      name,
      status: 'waiting',
    };
    state.tokens.push(token);
    broadcastState();
  });

  socket.on('call_next', () => {
    if (callNextLock) return;
    callNextLock = true;
    try {
      // Mark current in-progress as done
      if (state.currentToken) {
        const cur = state.tokens.find((t) => t.number === state.currentToken);
        if (cur && cur.status === 'in-progress') cur.status = 'done';
        state.currentToken = null;
      }
      // Find next waiting token
      const next = state.tokens.find((t) => t.status === 'waiting');
      if (next) {
        next.status = 'in-progress';
        state.currentToken = next.number;
      }
      broadcastState();
    } finally {
      // Release on next tick so a burst of clicks collapses into one advance
      setTimeout(() => { callNextLock = false; }, 50);
    }
  });

  socket.on('set_avg_time', (payload) => {
    const minutes = Number(payload && payload.minutes);
    if (!Number.isFinite(minutes) || minutes < 0) return;
    state.avgConsultTime = minutes;
    broadcastState();
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Queue Cure running on http://localhost:${PORT}`);
});
