import express from 'express';
import { getMilestones, createMilestone, updateMilestone, deleteMilestone } from '../controllers/milestoneController.js';
import protect from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validate.js';

const router = express.Router();

router.get('/:projectId/milestones',                      protect, getMilestones);
router.post('/:projectId/milestones',                     protect, validate(schemas.createMilestone), createMilestone);
router.patch('/:projectId/milestones/:milestoneId',       protect, updateMilestone);
router.delete('/:projectId/milestones/:milestoneId',      protect, deleteMilestone);

export default router;