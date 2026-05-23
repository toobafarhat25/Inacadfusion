const express = require('express');
const { generateLetter, getMyLetters, verifyLetter } = require('../controllers/experienceLetterController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/generate', protect, authorize('startup'), generateLetter);
router.get('/', protect, authorize('student'), getMyLetters);
router.get('/verify/:hash', verifyLetter); // Public route

module.exports = router;
