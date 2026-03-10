import Milestone from '../models/Milestone.js';
import Project from '../models/Project.js';
import Activity from '../models/Activity.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const requireProjectOwner = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, owner: userId });
  if (!project) {
    const err = new Error('Project not found.');
    err.status = 404;
    throw err;
  }
  return project;
};

// GET /api/projects/:projectId/milestones
export const getMilestones = asyncHandler(async (req, res) => {
  await requireProjectOwner(req.params.projectId, req.user._id);

  const milestones = await Milestone.find({ project: req.params.projectId })
    .sort({ order: 1, createdAt: 1 });

  const totalEscrow = milestones
    .filter((m) => m.status !== 'Paid')
    .reduce((sum, m) => sum + m.cost, 0);

  res.json({ milestones, totalEscrow });
});

// POST /api/projects/:projectId/milestones
export const createMilestone = asyncHandler(async (req, res) => {
  await requireProjectOwner(req.params.projectId, req.user._id);

  const { title, description, cost, photoProof, order } = req.body;

  const milestone = await Milestone.create({
    project: req.params.projectId,
    title,
    description,
    cost: Number(cost),
    status: 'Pending',
    photoProof: photoProof || '',
    order: order || 0
  });

  await Activity.create({
    project: req.params.projectId,
    type: 'milestone',
    title: 'New Milestone Added',
    description: `Milestone "${title}" added with budget KES ${Number(cost).toLocaleString()}.`,
    icon: 'fa-flag',
    iconColor: 'text-amber-400',
    performedBy: req.user._id
  });

  res.status(201).json({ milestone });
});

// PATCH /api/projects/:projectId/milestones/:milestoneId
export const updateMilestone = asyncHandler(async (req, res) => {
  await requireProjectOwner(req.params.projectId, req.user._id);

  const updateData = { ...req.body };
  if (req.body.status === 'Approved') updateData.approvedAt = new Date();
  if (req.body.status === 'Paid') updateData.paidAt = new Date();

  const milestone = await Milestone.findOneAndUpdate(
    { _id: req.params.milestoneId, project: req.params.projectId },
    { $set: updateData },
    { new: true }
  );

  if (!milestone) {
    const err = new Error('Milestone not found.');
    err.status = 404;
    throw err;
  }

  const statusActivityMap = {
    Approved: { title: 'Milestone Approved', desc: `Proof approved for "${milestone.title}".`, icon: 'fa-circle-check', color: 'text-emerald-400' },
    Paid:     { title: 'Funds Released',     desc: `KES ${milestone.cost.toLocaleString()} released for "${milestone.title}".`, icon: 'fa-money-bill-transfer', color: 'text-emerald-400' },
    Pending:  { title: 'Milestone Reset',    desc: `"${milestone.title}" set back to pending.`, icon: 'fa-clock', color: 'text-amber-400' }
  };

  const info = statusActivityMap[req.body.status];
  if (info) {
    await Activity.create({
      project: req.params.projectId,
      type: 'milestone',
      title: info.title,
      description: info.desc,
      icon: info.icon,
      iconColor: info.color,
      performedBy: req.user._id
    });
  }

  res.json({ milestone });
});

// DELETE /api/projects/:projectId/milestones/:milestoneId
export const deleteMilestone = asyncHandler(async (req, res) => {
  await requireProjectOwner(req.params.projectId, req.user._id);

  const milestone = await Milestone.findOneAndDelete({
    _id: req.params.milestoneId,
    project: req.params.projectId
  });

  if (!milestone) {
    const err = new Error('Milestone not found.');
    err.status = 404;
    throw err;
  }

  res.json({ message: 'Milestone deleted.' });
});