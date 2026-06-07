const express = require('express');
const { getConversations, createConversation, getMessages, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/conversations').get(getConversations).post(createConversation);
router.route('/messages/:conversationId').get(getMessages);
router.route('/messages').post(sendMessage);

module.exports = router;
