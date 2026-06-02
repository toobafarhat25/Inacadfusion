const Project = require('../models/Project');
const path = require('path');

// @desc    Get all projects (with filtering)
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res, next) => {
  try {
    const { domain, type, technologies, requiredSkills, minCost, maxCost, search } = req.query;
    const filter = { status: 'active' };

    if (domain) filter.domain = { $regex: domain, $options: 'i' };
    if (type) filter.type = type;
    if (technologies) filter.technologies = { $in: technologies.split(',').map(t => t.trim()) };
    if (requiredSkills) filter.requiredSkills = { $in: requiredSkills.split(',').map(s => s.trim()) };
    if (minCost || maxCost) {
      filter.cost = {};
      if (minCost) filter.cost.$gte = minCost;
      if (maxCost) filter.cost.$lte = maxCost;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { domain: { $regex: search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(filter)
      .populate({ path: 'uploadedBy', select: 'name email role' })
      .sort('-createdAt');

    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get projects of logged-in user
// @route   GET /api/projects/my-projects
// @access  Private
exports.getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ uploadedBy: req.user.id })
      .populate({ path: 'uploadedBy', select: 'name email role' })
      .sort('-createdAt');
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate({ path: 'uploadedBy', select: 'name email role profileDetails' });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Create new project (with optional files)
// @route   POST /api/projects
// @access  Private (Student/Startup)
exports.createProject = async (req, res, next) => {
  try {
    req.body.uploadedBy = req.user.id;
    if (req.user.role === 'student') req.body.type = 'student_fyp';
    if (req.user.role === 'startup') req.body.type = 'startup_idea';

    // Attach uploaded file paths if any
    if (req.files && req.files.length > 0) {
      req.body.files = req.files.map(f => `/uploads/${f.filename}`);
    }

    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    if (project.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this project' });
    }

    let updatedFiles = [];
    if (req.body.existingFiles) {
      updatedFiles = Array.isArray(req.body.existingFiles)
        ? req.body.existingFiles
        : [req.body.existingFiles];
    } else if (req.body.existingFiles === undefined) {
      updatedFiles = project.files || [];
    }

    if (req.files && req.files.length > 0) {
      updatedFiles = [...updatedFiles, ...req.files.map(f => `/uploads/${f.filename}`)];
    }
    req.body.files = updatedFiles;

    project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    if (project.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this project' });
    }

    await project.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
