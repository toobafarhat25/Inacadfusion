const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.ObjectId,
    ref: 'DirectMessage'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Conversation', conversationSchema);
