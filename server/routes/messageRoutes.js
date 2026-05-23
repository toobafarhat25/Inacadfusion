const express = require('express');
const { getMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/:collaborationId').get(getMessages);
router.route('/').post(sendMessage);

module.exports = router;
