import Project from '../models/Project.js';
import MaterialLog from '../models/MaterialLog.js';
import Milestone from '../models/Milestone.js';
import Permit from '../models/Permit.js';
import Activity from '../models/Activity.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// GET /api/projects
export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json({ projects });
});

// GET /api/projects/:id
export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
  if (!project) {
    const err = new Error('Project not found.');
    err.status = 404;
    throw err;
  }
  res.json({ project });
});

// POST /api/projects
export const createProject = asyncHandler(async (req, res) => {
  const { name, location, budget, completionDate, status } = req.body;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const spendingHistory = months.map((month) => ({
    month,
    budget: Math.round(Number(budget) / 6),
    spent: 0
  }));

  const project = await Project.create({
    name,
    location,
    budget: Number(budget),
    spent: 0,
    status: status || 'Planning',
    completionDate: completionDate || '',
    owner: req.user._id,
    spendingHistory
  });

  await Permit.insertMany([
    { project: project._id, name: 'NCA Project Registration', status: 'Pending', agency: 'NCA' },
    { project: project._id, name: 'NEMA EIA License', status: 'Pending', agency: 'NEMA' },
    { project: project._id, name: 'County Building Approval', status: 'Pending', agency: 'County' }
  ]);

  await Activity.create({
    project: project._id,
    type: 'general',
    title: 'Project Created',
    description: `Project "${name}" was created in ${location}.`,
    icon: 'fa-folder-plus',
    iconColor: 'text-blue-400',
    performedBy: req.user._id
  });

  res.status(201).json({ project });
});

// PATCH /api/projects/:id
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!project) {
    const err = new Error('Project not found.');
    err.status = 404;
    throw err;
  }
  res.json({ project });
});

// DELETE /api/projects/:id
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!project) {
    const err = new Error('Project not found.');
    err.status = 404;
    throw err;
  }

  await Promise.all([
    MaterialLog.deleteMany({ project: req.params.id }),
    Milestone.deleteMany({ project: req.params.id }),
    Permit.deleteMany({ project: req.params.id }),
    Activity.deleteMany({ project: req.params.id })
  ]);

  res.json({ message: 'Project and all related data deleted.' });
});