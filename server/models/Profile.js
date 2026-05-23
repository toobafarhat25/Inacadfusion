const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['student', 'startup'],
    required: true
  },
  bio: { type: String, default: '' },
  // Student fields
  skills: [String],
  education: { type: String, default: '' },
  university: { type: String, default: '' },
  portfolioLinks: [String],
  // Startup fields
  companyName: { type: String, default: '' },
  domain: { type: String, default: '' },
  description: { type: String, default: '' },
  requirements: [String]
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
