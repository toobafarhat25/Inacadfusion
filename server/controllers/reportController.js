const Report = require('../models/Report');

// @desc    Create a report
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res) => {
  try {
    const { targetId, targetType, reason } = req.body;
    const report = await Report.create({ reporterId: req.user.id, targetId, targetType, reason });
    res.status(201).json({ success: true, data: report });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get all reports (admin)
// @route   GET /api/admin/reports
// @access  Private (Admin)
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reporterId', 'name email role')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update report status (admin action)
// @route   PUT /api/admin/reports/:id
// @access  Private (Admin)
exports.updateReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
