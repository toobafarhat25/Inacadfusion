const ExperienceLetter = require('../models/ExperienceLetter');
const Collaboration = require('../models/Collaboration');
const crypto = require('crypto');

// @desc    Generate a new experience letter
// @route   POST /api/experience-letters/generate
// @access  Private (Startup only)
exports.generateLetter = async (req, res, next) => {
  try {
    const { collaborationId, performanceRating, remarks } = req.body;

    const collab = await Collaboration.findById(collaborationId).populate('projectId');
    
    if (!collab) return res.status(404).json({ success: false, message: 'Collaboration not found' });
    if (collab.status !== 'completed') return res.status(400).json({ success: false, message: 'Collaboration must be completed to issue a letter' });
    
    if (collab.startupId.toString() !== req.user.id) {
       return res.status(401).json({ success: false, message: 'Only the startup can issue this letter' });
    }

    // Check if letter already exists
    const existing = await ExperienceLetter.findOne({ studentId: collab.studentId, projectId: collab.projectId._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Letter already issued for this project' });
    }

    const verificationHash = crypto.randomBytes(16).toString('hex');

    const letter = await ExperienceLetter.create({
      studentId: collab.studentId,
      startupId: collab.startupId,
      projectId: collab.projectId._id,
      verificationHash,
      performanceRating,
      remarks
    });

    res.status(201).json({ success: true, data: letter });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get experience letters for student
// @route   GET /api/experience-letters
// @access  Private (Student)
exports.getMyLetters = async (req, res, next) => {
  try {
    const letters = await ExperienceLetter.find({ studentId: req.user.id })
      .populate('startupId', 'name')
      .populate('projectId', 'title domain');

    res.status(200).json({ success: true, count: letters.length, data: letters });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Verify letter by hash (Public)
// @route   GET /api/experience-letters/verify/:hash
// @access  Public
exports.verifyLetter = async (req, res, next) => {
  try {
    const letter = await ExperienceLetter.findOne({ verificationHash: req.params.hash })
      .populate('studentId', 'name email')
      .populate('startupId', 'name')
      .populate('projectId', 'title domain technologies');

    if (!letter) {
      return res.status(404).json({ success: false, verified: false, message: 'Invalid verification hash' });
    }

    res.status(200).json({ success: true, verified: true, data: letter });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
