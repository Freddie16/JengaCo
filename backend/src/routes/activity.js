import express from 'express';
import { getActivity } from '../controllers/activityController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.get('/:projectId/activity', protect, getActivity);

export default router;