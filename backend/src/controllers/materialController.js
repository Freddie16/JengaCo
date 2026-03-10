import MaterialLog from '../models/MaterialLog.js';
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

// GET /api/projects/:projectId/materials
export const getMaterials = asyncHandler(async (req, res) => {
  await requireProjectOwner(req.params.projectId, req.user._id);
  const materials = await MaterialLog.find({ project: req.params.projectId }).sort({ createdAt: -1 });
  res.json({ materials });
});

// POST /api/projects/:projectId/materials
export const createMaterial = asyncHandler(async (req, res) => {
  await requireProjectOwner(req.params.projectId, req.user._id);

  const { item, quantity, unit, cost, date, verified, photoUrl } = req.body;

  const material = await MaterialLog.create({
    project: req.params.projectId,
    item,
    quantity: Number(quantity),
    unit: unit || 'Units',
    cost: Number(cost),
    date: date || new Date().toISOString().split('T')[0],
    verified: verified || false,
    photoUrl: photoUrl || '',
    addedBy: req.user._id
  });

  await Project.findByIdAndUpdate(req.params.projectId, { $inc: { spent: Number(cost) } });

  await Activity.create({
    project: req.params.projectId,
    type: 'material',
    title: 'Material Receipt Logged',
    description: `${quantity} ${unit || 'units'} of ${item} delivered and logged.`,
    icon: 'fa-file-invoice-dollar',
    iconColor: 'text-green-400',
    performedBy: req.user._id
  });

  res.status(201).json({ material });
});

// PATCH /api/projects/:projectId/materials/:materialId
export const updateMaterial = asyncHandler(async (req, res) => {
  await requireProjectOwner(req.params.projectId, req.user._id);

  const material = await MaterialLog.findOneAndUpdate(
    { _id: req.params.materialId, project: req.params.projectId },
    { $set: req.body },
    { new: true }
  );

  if (!material) {
    const err = new Error('Material log not found.');
    err.status = 404;
    throw err;
  }
  res.json({ material });
});

// DELETE /api/projects/:projectId/materials/:materialId
export const deleteMaterial = asyncHandler(async (req, res) => {
  await requireProjectOwner(req.params.projectId, req.user._id);

  const material = await MaterialLog.findOneAndDelete({
    _id: req.params.materialId,
    project: req.params.projectId
  });

  if (!material) {
    const err = new Error('Material log not found.');
    err.status = 404;
    throw err;
  }

  await Project.findByIdAndUpdate(req.params.projectId, { $inc: { spent: -material.cost } });
  res.json({ message: 'Material log deleted.' });
});