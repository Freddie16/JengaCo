import express from 'express';
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from '../controllers/materialController.js';
import protect from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validate.js';

const router = express.Router();

router.get('/:projectId/materials',                       protect, getMaterials);
router.post('/:projectId/materials',                      protect, validate(schemas.createMaterial), createMaterial);
router.patch('/:projectId/materials/:materialId',         protect, updateMaterial);
router.delete('/:projectId/materials/:materialId',        protect, deleteMaterial);

export default router;