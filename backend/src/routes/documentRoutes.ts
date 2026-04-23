import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DocumentController } from '../controllers/documentController';
import { authenticate, requireRole } from '../middleware/auth';
import config from '../config/environment';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  if (config.allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.maxFileSize },
});

// Routes
router.post('/upload', authenticate, upload.single('file'), DocumentController.uploadDocument);
router.post('/:documentId/analyze', authenticate, DocumentController.analyzeDocument);
router.post('/:documentId/feedback', authenticate, requireRole(['teacher']), DocumentController.upsertFeedback);
router.post(
  '/:documentId/humanize',
  authenticate,
  DocumentController.humanizeDocument
);
router.get('/:documentId/report/docx', authenticate, DocumentController.downloadDocxReport);
router.get('/:documentId', authenticate, DocumentController.getDocument);
router.get('/', authenticate, DocumentController.listDocuments);
router.delete('/:documentId', authenticate, DocumentController.deleteDocument);

export default router;
