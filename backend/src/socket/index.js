const socketIO = require('socket.io');
const { verifyAccessToken } = require('../utils/jwt');
const { User } = require('../models');

let io;

const setupSocketIO = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = verifyAccessToken(token);
      if (!decoded) {
        return next(new Error('Invalid token'));
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.username}`);

    // Join user's room
    socket.join(`user:${socket.user._id}`);

    // Join admin room if admin
    if (socket.user.isAdmin()) {
      socket.join('admin');
    }

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`👋 User disconnected: ${socket.user.username}`);
    });
  });

  console.log('✅ Socket.IO initialized');
};

/**
 * Emit event to specific user
 */
const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

/**
 * Emit event to all admins
 */
const emitToAdmins = (event, data) => {
  if (io) {
    io.to('admin').emit(event, data);
  }
};

/**
 * Broadcast to all connected clients
 */
const broadcast = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

module.exports = {
  setupSocketIO,
  emitToUser,
  emitToAdmins,
  broadcast,
};
