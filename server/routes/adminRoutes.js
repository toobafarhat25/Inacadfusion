const express = require('express');
const { getUsers, deleteUser, getAnalytics } = require('../controllers/adminController');
const { getAllDisputes, resolveDispute } = require('../controllers/disputeController');
const { getAllReports, updateReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.route('/users').get(getUsers);
router.route('/users/:id').delete(deleteUser);
router.route('/analytics').get(getAnalytics);
router.route('/disputes').get(getAllDisputes);
router.route('/disputes/:id').put(resolveDispute);
router.route('/reports').get(getAllReports);
router.route('/reports/:id').put(updateReport);

module.exports = router;
