const express = require('express');
const { createDispute, getMyDisputes } = require('../controllers/disputeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.route('/').post(createDispute);
router.route('/my').get(getMyDisputes);

module.exports = router;
