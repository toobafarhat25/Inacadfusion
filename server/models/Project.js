const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Please add a project title'] },
  description: { type: String, required: [true, 'Please add a description'] },
  domain: { type: String, required: [true, 'Please specify a domain'] },
  requiredSkills: [String],
  technologies: [String],
  uploadedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'in-progress', 'completed'], default: 'active' },
  type: { type: String, enum: ['student_fyp', 'startup_idea'], required: true },
  cost: String,
  files: [String]   // file paths or URLs — F3
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
