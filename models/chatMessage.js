const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  customerInfo: {
    userId: {
      type: String,
      required: true
    },
    firstName: String,
    email: String,
    orderId: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['customer', 'support'],
    required: true
  }
});

const ChatMessage = mongoose.models.ChatMessage || mongoose.model("ChatMessage", ChatMessageSchema);

module.exports = ChatMessage;