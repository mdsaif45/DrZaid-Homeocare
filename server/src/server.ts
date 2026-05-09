// @ts-nocheck
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import { db } from './config/database.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import caseRecordRoutes from './routes/caseRecordRoutes.js';
import vitalsRoutes from './routes/vitalsRoutes.js';
import investigationRoutes from './routes/investigationRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for rate limiter (since we are behind Nginx)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Dr. Zaid Homeocare API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Dr. Zaid Homeocare API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      patients: '/api/patients',
      caseRecords: '/api/case-records',
      vitals: '/api/vitals',
      investigations: '/api/investigations',
      prescriptions: '/api/prescriptions',
      appointments: '/api/appointments',
    },
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/case-records', caseRecordRoutes);
app.use('/api/vitals', vitalsRoutes);
app.use('/api/investigations', investigationRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Database connection test
const startServer = async () => {
  try {
    // Test database connection
    await db.query('SELECT NOW()');
    logger.info('✅ Database connected successfully');

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 API Documentation: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

// Start the server
startServer();

export default app;
