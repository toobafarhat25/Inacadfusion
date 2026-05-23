const Message = require('../models/Message');
const Collaboration = require('../models/Collaboration');

// @desc    Get all messages for a collaboration
// @route   GET /api/messages/:collaborationId
// @access  Private (participants only)
exports.getMessages = async (req, res, next) => {
  try {
    const { collaborationId } = req.params;

    // Verify participant
    const collab = await Collaboration.findById(collaborationId);
    if (collab) {
      const isParticipant = collab.studentId.toString() === req.user.id ||
                            collab.startupId.toString() === req.user.id;
      if (!isParticipant) return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const messages = await Message.find({ collaborationId })
      .populate('senderId', 'name avatar role')
      .sort('createdAt');
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Send new message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { collaborationId, text } = req.body;

    const message = await Message.create({ collaborationId, senderId: req.user.id, text });
    const populatedMsg = await Message.findById(message._id).populate('senderId', 'name avatar role');

    // Emit to specific room only (F11 - Socket.IO rooms)
    req.app.get('io').to(collaborationId).emit(`message-${collaborationId}`, populatedMsg);

    res.status(201).json({ success: true, data: populatedMsg });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
