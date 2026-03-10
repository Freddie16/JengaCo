import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import protect from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', validate(schemas.register), register);
router.post('/login',    validate(schemas.login),    login);
router.get('/me',        protect,                    getMe);

export default router;