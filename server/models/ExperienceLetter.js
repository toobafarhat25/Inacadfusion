const mongoose = require('mongoose');

const experienceLetterSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  startupId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  verificationHash: {
    type: String,
    required: true,
    unique: true
  },
  performanceRating: Number,
  remarks: String
}, {
  timestamps: true
});

module.exports = mongoose.model('ExperienceLetter', experienceLetterSchema);
