import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import fs from 'fs';
import { connectDatabase } from './config/database';
import config from './config/environment';
import authRoutes from './routes/authRoutes';
import documentRoutes from './routes/documentRoutes';
import assignmentRoutes from './routes/assignmentRoutes';
import peerReviewRoutes from './routes/peerReviewRoutes';

const app: Express = express();

// Create uploads directory if it doesn't exist
if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindow * 60 * 1000,
  max: config.rateLimitMaxRequests,
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/peer-reviews', peerReviewRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(
  (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.error('Error:', error);
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ error: 'File size exceeds limit' });
        return;
      }
      res.status(400).json({ error: error.message });
      return;
    }
    if (error.message === 'Invalid file type') {
      res.status(400).json({ error: 'File type not supported' });
      return;
    }
    res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
);

// Start server
const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(config.port, () => {
      console.log(`\n🚀 Server running on http://localhost:${config.port}`);
      console.log(`📁 Upload directory: ${config.uploadDir}`);
      console.log(`🔑 JWT Secret configured: ${config.jwtSecret !== 'default_secret_key' ? '✅' : '⚠️  Using default'}`);
      console.log(`🤖 OpenAI API configured: ${config.openaiApiKey ? '✅' : '❌'}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
