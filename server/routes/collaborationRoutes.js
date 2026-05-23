const express = require('express');
const {
  createCollaboration,
  getCollaborations,
  getCollaborationHistory,
  updateCollaborationStatus,
  updateMilestone,
  addMilestone,
  deleteMilestone
} = require('../controllers/collaborationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.route('/history').get(getCollaborationHistory);
router.route('/').post(createCollaboration).get(getCollaborations);
router.route('/:id').put(updateCollaborationStatus);
router.route('/:id/milestones').post(addMilestone);
router.route('/:id/milestones/:milestoneId')
  .put(updateMilestone)
  .delete(deleteMilestone);

module.exports = router;
