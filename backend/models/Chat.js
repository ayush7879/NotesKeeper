const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChatSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: ''
  },
  fileUrl: {
    type: String,
    default: ''
  },
  fileType: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Chat = mongoose.model('chat', ChatSchema);
module.exports = Chat;
