const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['collaboration', 'milestone', 'dispute', 'system', 'info', 'success'],
    default: 'system'
  },
  isRead: { type: Boolean, default: false },
  relatedId: { type: mongoose.Schema.ObjectId }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
