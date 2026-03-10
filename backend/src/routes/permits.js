import express from 'express';
import { getPermits, updatePermit } from '../controllers/permitController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.get('/:projectId/permits', protect, getPermits);
router.patch('/:projectId/permits/:permitId', protect, updatePermit);

export default router;