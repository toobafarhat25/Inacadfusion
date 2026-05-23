const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporterId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  targetId: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  targetType: {
    type: String,
    enum: ['user', 'project'],
    required: true
  },
  reason: {
    type: String,
    required: [true, 'Please provide a reason']
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'actioned'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
