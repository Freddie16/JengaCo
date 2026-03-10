import express from 'express';
import { getFundis, createFundi } from '../controllers/fundiController.js';
import protect from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validate.js';

const router = express.Router();

router.get('/',  protect,                             getFundis);
router.post('/', protect, validate(schemas.createFundi), createFundi);

export default router;