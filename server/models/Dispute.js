const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  collaborationId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Collaboration',
    required: true
  },
  reason: {
    type: String,
    required: [true, 'Please provide a reason for the dispute']
  },
  status: {
    type: String,
    enum: ['open', 'resolved'],
    default: 'open'
  },
  adminResponse: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Dispute', disputeSchema);
