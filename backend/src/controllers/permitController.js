import Permit from '../models/Permit.js';
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

// GET /api/projects/:projectId/permits
export const getPermits = asyncHandler(async (req, res) => {
  await requireProjectOwner(req.params.projectId, req.user._id);
  const permits = await Permit.find({ project: req.params.projectId });
  res.json({ permits });
});

// PATCH /api/projects/:projectId/permits/:permitId
export const updatePermit = asyncHandler(async (req, res) => {
  await requireProjectOwner(req.params.projectId, req.user._id);

  const permit = await Permit.findOneAndUpdate(
    { _id: req.params.permitId, project: req.params.projectId },
    { $set: req.body },
    { new: true }
  );

  if (!permit) {
    const err = new Error('Permit not found.');
    err.status = 404;
    throw err;
  }

  if (req.body.status === 'Approved') {
    await Activity.create({
      project: req.params.projectId,
      type: 'permit',
      title: 'Permit Approved',
      description: `${permit.name} has been approved by ${permit.agency}.`,
      icon: 'fa-certificate',
      iconColor: 'text-amber-400',
      performedBy: req.user._id
    });
  }

  res.json({ permit });
});