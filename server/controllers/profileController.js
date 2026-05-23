const Profile = require('../models/Profile');

// @desc    Get logged-in user profile (auto-create if not exists)
// @route   GET /api/profile/me
// @access  Private
exports.getMyProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = await Profile.create({ userId: req.user.id, role: req.user.role });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update (upsert) logged-in user profile
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { ...req.body, userId: req.user.id, role: req.user.role },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
