const Dispute = require('../models/Dispute');
const Collaboration = require('../models/Collaboration');

// @desc    Raise a dispute on a collaboration
// @route   POST /api/disputes
// @access  Private (involved participants only)
exports.createDispute = async (req, res) => {
  try {
    const { collaborationId, reason } = req.body;
    const collab = await Collaboration.findById(collaborationId);
    if (!collab) return res.status(404).json({ success: false, message: 'Collaboration not found' });

    const isParticipant = collab.studentId.toString() === req.user.id ||
                          collab.startupId.toString() === req.user.id;
    if (!isParticipant) return res.status(403).json({ success: false, message: 'Not a participant of this collaboration' });

    const dispute = await Dispute.create({ userId: req.user.id, collaborationId, reason });
    res.status(201).json({ success: true, data: dispute });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get all disputes (admin)
// @route   GET /api/admin/disputes
// @access  Private (Admin)
exports.getAllDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find()
      .populate('userId', 'name email role')
      .populate('collaborationId')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: disputes.length, data: disputes });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Resolve a dispute
// @route   PUT /api/admin/disputes/:id
// @access  Private (Admin)
exports.resolveDispute = async (req, res) => {
  try {
    const dispute = await Dispute.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved', adminResponse: req.body.adminResponse },
      { new: true }
    );
    if (!dispute) return res.status(404).json({ success: false, message: 'Dispute not found' });
    res.status(200).json({ success: true, data: dispute });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get disputes for current user
// @route   GET /api/disputes/my
// @access  Private
exports.getMyDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find({ userId: req.user.id })
      .populate('collaborationId')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: disputes });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
