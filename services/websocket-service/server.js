const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'websocket-service',
    connections: io.engine.clientsCount
  });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join room
  socket.on('join-room', (room) => {
    socket.join(room);
    socket.to(room).emit('user-joined', { userId: socket.id });
    console.log(`User ${socket.id} joined room ${room}`);
  });

  // Handle chat messages
  socket.on('chat-message', (data) => {
    const message = {
      id: Date.now(),
      userId: socket.id,
      message: data.message,
      room: data.room,
      timestamp: new Date().toISOString()
    };
    
    io.to(data.room).emit('chat-message', message);
    console.log('Message sent to room', data.room, ':', message);
  });

  // Handle system notifications
  socket.on('system-notification', (data) => {
    const notification = {
      type: 'system',
      message: data.message,
      timestamp: new Date().toISOString()
    };
    
    io.emit('notification', notification);
  });

  // Handle real-time updates
  socket.on('data-update', (data) => {
    socket.broadcast.emit('data-changed', {
      type: data.type,
      payload: data.payload,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// REST endpoints for WebSocket management
app.get('/api/stats', (req, res) => {
  res.json({
    connected_clients: io.engine.clientsCount,
    rooms: Object.keys(io.sockets.adapter.rooms),
    uptime: process.uptime()
  });
});

app.post('/api/broadcast', (req, res) => {
  const { message, room } = req.body;
  
  if (room) {
    io.to(room).emit('broadcast', {
      message,
      timestamp: new Date().toISOString()
    });
  } else {
    io.emit('broadcast', {
      message,
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({ success: true, message: 'Message broadcasted' });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`WebSocket service running on port ${PORT}`);
});