const Collaboration = require('../models/Collaboration');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

// @desc    Initiate new collaboration request
// @route   POST /api/collaborations
// @access  Private
exports.createCollaboration = async (req, res, next) => {
  try {
    const { projectId, milestones } = req.body;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    if (req.user.id === project.uploadedBy.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot collaborate on your own project' });
    }

    let studentId, startupId;
    if (req.user.role === 'student') {
      studentId = req.user.id;
      startupId = project.uploadedBy;
    } else if (req.user.role === 'startup') {
      startupId = req.user.id;
      studentId = project.uploadedBy;
    } else {
      return res.status(403).json({ success: false, message: 'Admins cannot initiate collaborations' });
    }

    const existing = await Collaboration.findOne({
      projectId, studentId, startupId, status: { $in: ['pending', 'active'] }
    });
    if (existing) return res.status(400).json({ success: false, message: 'Collaboration request already exists' });

    const collab = await Collaboration.create({ projectId, studentId, startupId, milestones });

    const notifyUserId = req.user.role === 'student' ? startupId : studentId;
    await Notification.create({
      userId: notifyUserId,
      title: 'New Collaboration Request',
      message: `${req.user.name} initiated a collaboration on: ${project.title}`,
      type: 'collaboration',
      relatedId: collab._id
    });

    const io = req.app.get('io');
    io.emit('notification', { userId: notifyUserId });

    res.status(201).json({ success: true, data: collab });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get user collaborations (active/pending/rejected)
// @route   GET /api/collaborations
// @access  Private
exports.getCollaborations = async (req, res, next) => {
  try {
    const query = req.user.role === 'student'
      ? { studentId: req.user.id }
      : req.user.role === 'startup' ? { startupId: req.user.id } : {};

    const collabs = await Collaboration.find(query)
      .populate({ path: 'projectId', select: 'title domain status uploadedBy', populate: { path: 'uploadedBy', select: 'name email' } })
      .populate('studentId', 'name email')
      .populate('startupId', 'name email')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: collabs.length, data: collabs });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get completed collaborations (history/portfolio)
// @route   GET /api/collaborations/history
// @access  Private
exports.getCollaborationHistory = async (req, res, next) => {
  try {
    const query = req.user.role === 'student'
      ? { studentId: req.user.id, status: 'completed' }
      : { startupId: req.user.id, status: 'completed' };

    const collabs = await Collaboration.find(query)
      .populate('projectId', 'title domain technologies')
      .populate('studentId', 'name email')
      .populate('startupId', 'name email')
      .sort('-completedAt');

    res.status(200).json({ success: true, count: collabs.length, data: collabs });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update collaboration status (Accept/Reject/Complete/Cancel)
// @route   PUT /api/collaborations/:id
// @access  Private
exports.updateCollaborationStatus = async (req, res, next) => {
  try {
    let collab = await Collaboration.findById(req.params.id).populate('projectId', 'uploadedBy title');
    if (!collab) return res.status(404).json({ success: false, message: 'Collaboration not found' });

    const { status } = req.body;

    // Check authorization: must be student or startup participant
    const isParticipant = collab.studentId.toString() === req.user.id || 
                          collab.startupId.toString() === req.user.id;
    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this collaboration' });
    }

    // Only the project owner can accept/reject a new request
    if (['active', 'rejected'].includes(status)) {
      const ownerId = collab.projectId?.uploadedBy?.toString();
      if (ownerId && ownerId !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Only the project owner can accept or reject this collaboration' });
      }
    }

    collab.status = status;
    if (status === 'completed') collab.completedAt = Date.now();
    await collab.save();

    // Auto-update Project status when collaboration is accepted, completed, or cancelled
    if (collab.projectId) {
      if (status === 'active') {
        await Project.findByIdAndUpdate(collab.projectId._id, { status: 'in-progress' });
      } else if (status === 'completed') {
        await Project.findByIdAndUpdate(collab.projectId._id, { status: 'completed' });
      } else if (status === 'cancelled') {
        await Project.findByIdAndUpdate(collab.projectId._id, { status: 'active' });
      }
    }

    // Notify the other party
    const notifyUserId = req.user.id === collab.studentId.toString() ? collab.startupId : collab.studentId;
    const statusLabel = status === 'active' ? 'accepted' : status;
    await Notification.create({
      userId: notifyUserId,
      title: `Collaboration ${statusLabel}`,
      message: `Your collaboration on "${collab.projectId?.title}" was ${statusLabel}.`,
      type: 'collaboration',
      relatedId: collab._id
    });
    req.app.get('io').emit('notification', { userId: notifyUserId });

    res.status(200).json({ success: true, data: collab });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update a specific milestone (with verification flow)
// @route   PUT /api/collaborations/:id/milestones/:milestoneId
// @access  Private
exports.updateMilestone = async (req, res, next) => {
  try {
    const collab = await Collaboration.findById(req.params.id);
    if (!collab) return res.status(404).json({ success: false, message: 'Collaboration not found' });

    const milestone = collab.milestones.id(req.params.milestoneId);
    if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });

    // Update fields if provided (Title/Desc/DueDate only by Startup)
    if (req.user.role === 'startup') {
      if (req.body.title) milestone.title = req.body.title;
      if (req.body.description) milestone.description = req.body.description;
      if (req.body.dueDate) milestone.dueDate = req.body.dueDate;
    }
    
    // Status Logic
    if (req.body.status || req.body.isAccepted !== undefined) {
      const oldStatus = milestone.status;
      if (req.body.status) milestone.status = req.body.status;
      
      // Verification & Approval Flow
      if (req.user.role === 'student') {
        if (req.body.status === 'completed' && oldStatus !== 'completed') {
          // Student submission
          milestone.submittedAt = Date.now();
          milestone.isVerified = false;
          
          await Notification.create({
            userId: collab.startupId,
            title: 'Milestone Awaiting Verification',
            message: `Milestone "${milestone.title}" has been submitted for review.`,
            type: 'milestone',
            relatedId: collab._id
          });
          req.app.get('io').emit('notification', { userId: collab.startupId });
        }

        // Student "Saying Yes" (Accepting the proposed milestone)
        if (req.body.isAccepted === true && !milestone.isAccepted) {
          milestone.isAccepted = true;
          milestone.status = 'in-progress';
          await Notification.create({
            userId: collab.startupId,
            title: 'Milestone Accepted',
            message: `The student accepted your proposed task: "${milestone.title}".`,
            type: 'milestone',
            relatedId: collab._id
          });
          req.app.get('io').emit('notification', { userId: collab.startupId });
        }
      }

      if (req.user.role === 'startup') {
        if (req.body.isVerified) {
          milestone.isVerified = true;
          milestone.verifiedAt = Date.now();
          milestone.completedAt = Date.now();
          milestone.status = 'completed';

          await Notification.create({
            userId: collab.studentId,
            title: 'Milestone Verified',
            message: `Milestone "${milestone.title}" has been verified and confirmed.`,
            type: 'milestone',
            relatedId: collab._id
          });
          req.app.get('io').emit('notification', { userId: collab.studentId });
        } else if (oldStatus === 'completed' && req.body.status === 'in-progress') {
          // Rejection / Return for rework
          milestone.isVerified = false;
          await Notification.create({
            userId: collab.studentId,
            title: 'Milestone Requires Rework',
            message: `The startup requested changes for: "${milestone.title}".`,
            type: 'milestone',
            relatedId: collab._id
          });
          req.app.get('io').emit('notification', { userId: collab.studentId });
        }
      }
    }

    await collab.save();
    res.status(200).json({ success: true, data: collab });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Add a milestone to collaboration
// @route   POST /api/collaborations/:id/milestones
// @access  Private
exports.addMilestone = async (req, res, next) => {
  try {
    const collab = await Collaboration.findById(req.params.id);
    if (!collab) return res.status(404).json({ success: false, message: 'Collaboration not found' });

    // Allow both student and startup to add milestones
    const isParticipant = collab.studentId.toString() === req.user.id || 
                          collab.startupId.toString() === req.user.id;
                          
    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Not authorized to add milestones to this collaboration' });
    }

    const { title, description, dueDate } = req.body;
    collab.milestones.push({ title, description, dueDate });
    
    // Notify student if startup adds a milestone
    if (req.user.role === 'startup') {
      await Notification.create({
        userId: collab.studentId,
        title: 'New Milestone Proposed',
        message: `Startup added a new task to your roadmap: "${title}". Please review and accept.`,
        type: 'milestone',
        relatedId: collab._id
      });
      req.app.get('io').emit('notification', { userId: collab.studentId });
    }
    
    // Original notification for student -> startup (if student adds)
    if (req.user.role === 'student') {
      await Notification.create({
        userId: collab.startupId,
        title: 'New Milestone Proposed',
        message: `Student ${req.user.name} added a new task: "${title}".`,
        type: 'milestone',
        relatedId: collab._id
      });
      req.app.get('io').emit('notification', { userId: collab.startupId });
    }
    
    await collab.save();
    res.status(200).json({ success: true, data: collab });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete a milestone from collaboration
// @route   DELETE /api/collaborations/:id/milestones/:milestoneId
// @access  Private
exports.deleteMilestone = async (req, res, next) => {
  try {
    const collab = await Collaboration.findById(req.params.id);
    if (!collab) return res.status(404).json({ success: false, message: 'Collaboration not found' });

    // Allow both student and startup to delete milestones
    const isParticipant = collab.studentId.toString() === req.user.id || 
                          collab.startupId.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete milestones' });
    }

    const milestone = collab.milestones.id(req.params.milestoneId);
    if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });
    
    const milestoneTitle = milestone.title;
    const wasAccepted = milestone.isAccepted;

    collab.milestones.pull({ _id: req.params.milestoneId });
    
    await collab.save();

    // Notify the other party if appropriate
    if (req.user.role === 'student' && !wasAccepted) {
      await Notification.create({
        userId: collab.startupId,
        title: 'Milestone Declined',
        message: `The student declined the proposed task: "${milestoneTitle}".`,
        type: 'milestone',
        relatedId: collab._id
      });
      req.app.get('io').emit('notification', { userId: collab.startupId });
    }

    res.status(200).json({ success: true, data: collab });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
