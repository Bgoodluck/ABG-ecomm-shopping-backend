const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { createChatMessage } = require('../controllers/chatMessageController');
const userModel = require('../models/userModel');

function setupSocketIO(server) {
  const io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || 
                    socket.handshake.headers.authorization?.split(' ')[1] || 
                    socket.handshake.cookies?.token;

      if (!token) {
        return next(new Error('Authentication error: No token'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      console.error('Socket Authentication Error:', error);
      return next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.user?.email || 'Unauthenticated');


    // Notify operators of new connection
  socket.broadcast.emit('operator_alert', {
    message: `User ${socket.user?.email || 'Guest'} connected.`,
  });

    // Handle incoming messages
    socket.on('send_message', async (data) => {
      try {


        // Static Predefined Responses
      const predefinedResponses = {
        hello: "Hi there! How can I assist you today?",
        pricing: "Our pricing plans are available at www.example.com/pricing",
      };
      const predefinedResponse =
        predefinedResponses[data.message.toLowerCase()];

      if (predefinedResponse) {
        io.emit('receive_message', {
          sender: 'Support Bot',
          message: predefinedResponse,
          timestamp: new Date(),
        });
        return;
      }

      // AI-Powered Response Placeholder
      if (data.message.includes('AI')) {
        io.emit('receive_message', {
          sender: 'AI Assistant',
          message: 'I am processing your request. Please hold on!',
          timestamp: new Date(),
        });
        return;
      }

      // Human Operator Reply
      if (data.needsHumanOperator) {
        io.emit('operator_alert', {
          message: `User ${socket.user?.email || 'Guest'} needs human assistance.`,
        });
      }



        // Add user information from authenticated socket
        data.customerInfo = {
          userId: socket.user._id,
          firstName: socket.user.firstName,
          email: socket.user.email
        };
        data.sender = socket.user.firstName; // Or however you want to set the sender

        // Create and save message to MongoDB
        const newMessage = await createChatMessage(data);

        // Broadcast message to all connected clients
        io.emit('receive_message', newMessage);
      } catch (error) {
        console.error('Socket Message Error:', error);
      }
    });

    // Handle user typing
    socket.on('typing', (data) => {
      socket.broadcast.emit('typing', { userId: data.userId, isTyping: data.isTyping });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
      socket.broadcast.emit('operator_alert', {
        message: `User ${socket.user?.email || 'Guest'} disconnected.`,
      });
    });
  });

  return io;
}

module.exports = setupSocketIO;