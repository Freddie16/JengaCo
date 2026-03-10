import Activity from '../models/Activity.js';
import Project from '../models/Project.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// GET /api/projects/:projectId/activity
export const getActivity = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.projectId, owner: req.user._id });
  if (!project) {
    const err = new Error('Project not found.');
    err.status = 404;
    throw err;
  }

  const limit = Math.min(parseInt(req.query.limit) || 10, 50); // cap at 50

  const activities = await Activity.find({ project: req.params.projectId })
    .populate('performedBy', 'name')
    .sort({ createdAt: -1 })
    .limit(limit);

  res.json({ activities });
});