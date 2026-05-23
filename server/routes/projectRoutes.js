const express = require('express');
const {
  getProjects,
  getMyProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

// Protected: my projects
router.route('/my-projects').get(protect, getMyProjects);

// Public list with filters
router.route('/').get(getProjects).post(protect, authorize('student', 'startup'), upload.array('files', 5), createProject);

// Single project
router.route('/:id')
  .get(getProject)
  .put(protect, upload.array('files', 5), updateProject)
  .delete(protect, deleteProject);

module.exports = router;
