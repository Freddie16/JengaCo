import express from 'express';
import { getProjects, getProject, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import protect from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validate.js';

const router = express.Router();

router.get('/',    protect,                               getProjects);
router.post('/',   protect, validate(schemas.createProject), createProject);
router.get('/:id', protect,                               getProject);
router.patch('/:id', protect,                             updateProject);
router.delete('/:id', protect,                            deleteProject);

export default router;