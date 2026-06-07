const Conversation = require('../models/Conversation');
const DirectMessage = require('../models/DirectMessage');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get all conversations for logged in user
// @route   GET /api/chat/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
      .populate('participants', 'name email role profileDetails avatar')
      .populate('lastMessage')
      .sort('-updatedAt');
      
    res.status(200).json({ success: true, data: conversations });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get or create conversation with a user
// @route   POST /api/chat/conversations
// @access  Private
exports.createConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;
    if (!receiverId) return res.status(400).json({ success: false, message: 'Receiver ID required' });

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, receiverId] }
    }).populate('participants', 'name email role profileDetails avatar');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, receiverId]
      });
      conversation = await conversation.populate('participants', 'name email role profileDetails avatar');
    }

    res.status(200).json({ success: true, data: conversation });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/messages/:conversationId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });
    if (!conversation.participants.includes(req.user.id)) return res.status(403).json({ success: false, message: 'Access denied' });

    const messages = await DirectMessage.find({ conversationId })
      .populate('senderId', 'name avatar role')
      .sort('createdAt');
      
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Send a message
// @route   POST /api/chat/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });
    if (!conversation.participants.includes(req.user.id)) return res.status(403).json({ success: false, message: 'Access denied' });

    const message = await DirectMessage.create({
      conversationId,
      senderId: req.user.id,
      text
    });

    conversation.lastMessage = message._id;
    await conversation.save();

    const populatedMsg = await DirectMessage.findById(message._id).populate('senderId', 'name avatar role');
    const sender = populatedMsg.senderId;

    // Determine receiver (the other participant)
    const receiverId = conversation.participants.find(
      p => p.toString() !== req.user.id.toString()
    );

    if (receiverId) {
      // 1. Save a notification in DB
      const notification = await Notification.create({
        userId: receiverId,
        title: 'New Message',
        message: `${sender.name} sent you a message: "${text.length > 60 ? text.slice(0, 60) + '…' : text}"`,
        type: 'message',
        relatedId: conversationId,
        link: `/${sender.role === 'startup' ? 'student' : 'startup'}/messages`
      });

      // 2. Emit real-time notification event so the bell badge updates instantly
      req.app.get('io').emit('notification', {
        userId: receiverId.toString(),
        notification
      });
    }

    // 3. Emit the chat message to conversation room
    req.app.get('io').to(conversationId).emit(`direct-message-${conversationId}`, populatedMsg);

    res.status(201).json({ success: true, data: populatedMsg });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
