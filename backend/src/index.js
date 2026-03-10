import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import { requestLogger } from './middleware/logger.js';
import { sanitizeBody, sanitizeParams } from './middleware/sanitize.js';
import { authLimiter, apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import materialRoutes from './routes/materials.js';
import milestoneRoutes from './routes/milestones.js';
import fundiRoutes from './routes/fundis.js';
import permitRoutes from './routes/permits.js';
import activityRoutes from './routes/activity.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Required for correct req.ip behind Render / Railway / Heroku load balancers
app.set('trust proxy', 1);

// CORS — allow list from env var, plus no-origin requests (Render health checks, curl)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true
}));

// Global middleware — order matters
app.use(requestLogger);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeBody);
app.use(sanitizeParams);
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth',     authLimiter, authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', materialRoutes);
app.use('/api/projects', milestoneRoutes);
app.use('/api/projects', permitRoutes);
app.use('/api/projects', activityRoutes);
app.use('/api/fundis',   fundiRoutes);

// Health check — Render pings this to confirm the service is alive
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'JengaHub API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found.` });
});

// Centralised error handler — must be last
app.use(errorHandler);

// Connect and start
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 JengaHub API on port ${PORT} [${process.env.NODE_ENV}]`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

export default app;