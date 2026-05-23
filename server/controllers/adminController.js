const User = require('../models/User');
const Project = require('../models/Project');
const Collaboration = require('../models/Collaboration');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Ban or delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await user.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get enhanced platform analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
exports.getAnalytics = async (req, res, next) => {
  try {
    const [studentsCount, startupsCount, totalProjects, activeProjects,
           totalCollaborations, completedCollabs, pendingCollabs, activeCollabs,
           fypProjects, ideaProjects, allProjects] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'startup' }),
      Project.countDocuments(),
      Project.countDocuments({ status: 'active' }),
      Collaboration.countDocuments(),
      Collaboration.countDocuments({ status: 'completed' }),
      Collaboration.countDocuments({ status: 'pending' }),
      Collaboration.countDocuments({ status: 'active' }),
      Project.countDocuments({ type: 'student_fyp' }),
      Project.countDocuments({ type: 'startup_idea' }),
      Project.find({}, 'requiredSkills technologies')
    ]);

    const skillCounts = {};
    allProjects.forEach(p => {
      [...(p.requiredSkills || []), ...(p.technologies || [])].forEach(skill => {
        if (skill) skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });
    const mostCommonSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([skill, count]) => ({ skill, count }));

    res.status(200).json({
      success: true,
      data: {
        users: { students: studentsCount, startups: startupsCount, total: studentsCount + startupsCount },
        projects: { total: totalProjects, active: activeProjects, fyp: fypProjects, ideas: ideaProjects },
        collaborations: { total: totalCollaborations, completed: completedCollabs, pending: pendingCollabs, active: activeCollabs },
        mostCommonSkills
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
