const express = require('express');
const { getMyProfile, updateProfile, getAllStudents } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.route('/me').get(getMyProfile);
router.route('/').put(updateProfile);
router.route('/students').get(getAllStudents);

module.exports = router;
