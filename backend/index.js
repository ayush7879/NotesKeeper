const connectToMongo= require("./db");
const express= require('express');
var cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const path = require('path');
const Chat = require('./models/Chat');
const User = require('./models/User');

connectToMongo();
// console.log("here i am ")
const app=express()
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const port= 5000
app.use(cors())
app.get('/',(req,res)=>{
    res.send('Hello World')
})
app.use(express.json());
// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Available Routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));
app.use('/api/chat',require('./routes/chat'));

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: 'API route not found' });
});

// General 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Socket.io authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    const decoded = jwt.verify(token, 'ayushagrawal');
    socket.userId = decoded.user.id;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('✅ User connected to chat server - User ID:', socket.userId);

  socket.on('message', async (data) => {
    try {
      // Save message to database
      const chatMessage = await Chat.create({
        senderId: data.senderId,
        receiverId: data.receiverId,
        message: data.message,
        timestamp: data.timestamp || new Date()
      });

      // Populate sender info
      const populatedMessage = await Chat.findById(chatMessage._id)
        .populate('senderId', 'name email')
        .populate('receiverId', 'name email');

      // Emit to receiver
      io.emit('message', {
        ...populatedMessage.toObject(),
        sender: populatedMessage.senderId._id.toString(),
        receiver: populatedMessage.receiverId._id.toString()
      });
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('file', async (data) => {
    try {
      // File is already saved via upload endpoint, just broadcast
      const chatMessage = await Chat.findOne({
        senderId: data.senderId,
        receiverId: data.receiverId,
        fileName: data.fileName
      })
        .populate('senderId', 'name email')
        .populate('receiverId', 'name email');

      if (chatMessage) {
        io.emit('file', {
          ...chatMessage.toObject(),
          sender: chatMessage.senderId._id.toString(),
          receiver: chatMessage.receiverId._id.toString()
        });
      }
    } catch (error) {
      console.error('Error broadcasting file:', error);
      socket.emit('error', { message: 'Failed to send file' });
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected from chat server - User ID:', socket.userId);
  });
});

server.listen(port,()=>{
    console.log(`✅ Backend server running on port ${port}`);
    console.log(`✅ Socket.io server ready`);
    console.log(`✅ API available at http://localhost:${port}/api`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use!`);
        console.error('Please stop the existing server or use a different port.');
        console.error('To find and kill the process: netstat -ano | findstr :5000');
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});

// Error handling
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
