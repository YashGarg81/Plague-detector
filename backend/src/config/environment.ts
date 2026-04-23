import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define environment variable types
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      NODE_ENV?: 'development' | 'production' | 'test';
      API_URL?: string;
      MONGODB_URI?: string;
      JWT_SECRET?: string;
      OPENAI_API_KEY?: string;
      AI_SERVICE_URL?: string;
      MAX_FILE_SIZE?: string;
      ALLOWED_EXTENSIONS?: string;
      FRONTEND_URL?: string;
      RATE_LIMIT_WINDOW?: string;
      RATE_LIMIT_MAX_REQUESTS?: string;
      AI_DETECTION_THRESHOLD?: string;
      PLAGIARISM_THRESHOLD?: string;
    }
  }
}

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiUrl: process.env.API_URL || 'http://localhost:5000',
  
  // Database
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/plaque',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'default_secret_key',
  jwtExpiry: '7d',
  
  // OpenAI
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  
  // File Upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '50000000'),
  allowedExtensions: (process.env.ALLOWED_EXTENSIONS || 'pdf,doc,docx').split(','),
  uploadDir: 'uploads',
  
  // CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Rate Limiting
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '15'),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  
  // AI Detection
  aiDetectionThreshold: parseFloat(process.env.AI_DETECTION_THRESHOLD || '0.6'),
  plagiarismThreshold: parseFloat(process.env.PLAGIARISM_THRESHOLD || '0.3'),
};

export default config;
