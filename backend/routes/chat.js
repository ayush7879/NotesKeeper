const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Get all users for chat
router.get('/users', fetchuser, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    console.log(`Found ${users.length} users in database`);
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Get chat history between two users
router.get('/history/:receiverId', fetchuser, async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.receiverId;

    const messages = await Chat.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email')
      .sort({ timestamp: 1 });

    res.json({ success: true, messages });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Upload file
router.post('/upload', fetchuser, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const senderId = req.user.id;
    const receiverId = req.body.receiverId;

    const fileUrl = `/uploads/${req.file.filename}`;
    
    // Save file info to database
    const chatMessage = await Chat.create({
      senderId: senderId,
      receiverId: receiverId,
      fileName: req.file.originalname,
      fileUrl: fileUrl,
      fileType: req.file.mimetype,
      timestamp: new Date()
    });

    res.json({
      success: true,
      fileName: req.file.originalname,
      fileUrl: fileUrl,
      fileType: req.file.mimetype,
      message: chatMessage
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Serve uploaded files
router.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ success: false, error: 'File not found' });
  }
});

module.exports = router;
