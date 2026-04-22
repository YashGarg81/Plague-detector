import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import Document from '../models/Document';
import { FileProcessor } from '../services/fileProcessor';
import { AIDetectionService } from '../services/aiDetection';
import { HumanizationService, RewriteStyle } from '../services/humanization';
import { AuthRequest } from '../middleware/auth';
import config from '../config/environment';

export class DocumentController {
  static async uploadDocument(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file provided' });
        return;
      }

      const file = req.file;
      const fileExt = path.extname(file.originalname).toLowerCase().slice(1);

      // Validate file type
      if (!config.allowedExtensions.includes(fileExt)) {
        res.status(400).json({ error: 'File type not supported' });
        fs.unlinkSync(file.path);
        return;
      }

      // Validate file size
      if (file.size > config.maxFileSize) {
        res.status(400).json({ error: 'File size exceeds limit' });
        fs.unlinkSync(file.path);
        return;
      }

      // Extract text from document
      let extractedText = '';
      try {
        extractedText = await FileProcessor.extractText(
          file.path,
          file.mimetype
        );
      } catch (extractError) {
        fs.unlinkSync(file.path);
        res.status(400).json({
          error: `Failed to extract text: ${
            extractError instanceof Error ? extractError.message : 'Unknown error'
          }`,
        });
        return;
      }

      if (!extractedText || extractedText.length < 50) {
        fs.unlinkSync(file.path);
        res.status(400).json({ error: 'Extracted text is too short' });
        return;
      }

      // Clean and store the text
      extractedText = FileProcessor.cleanText(extractedText);

      // Create document record
      const document = new Document({
        userId: req.userId,
        filename: uuidv4() + '.' + fileExt,
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
        extractedText,
        status: 'pending',
      });

      await document.save();

      // Rename uploaded file with UUID
      const newPath = path.join(
        config.uploadDir,
        document.filename
      );
      fs.renameSync(file.path, newPath);

      res.status(201).json({
        message: 'Document uploaded successfully',
        document: {
          id: document._id,
          originalName: document.originalName,
          fileSize: document.fileSize,
          extractedText: extractedText.substring(0, 500) + '...',
          status: document.status,
        },
      });
    } catch (error) {
      console.error('Upload error:', error);
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: 'Upload failed' });
    }
  }

  static async analyzeDocument(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { documentId } = req.params;

      const document = await Document.findById(documentId);

      if (!document) {
        res.status(404).json({ error: 'Document not found' });
        return;
      }

      if (document.userId.toString() !== req.userId) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      // Update status
      document.status = 'processing';
      await document.save();

      try {
        // Run analysis
        const analysisResult = await AIDetectionService.analyzeFullDocument(
          document.extractedText
        );

        document.analysis = analysisResult as any;
        document.status = 'completed';
        await document.save();

        res.json({
          message: 'Analysis completed',
          analysis: {
            aiScore: analysisResult.aiScore,
            plagiarismScore: analysisResult.plagiarismScore,
            confidence: analysisResult.confidence,
            flaggedSections: analysisResult.flaggedSections,
            wordCount: document.extractedText.split(/\s+/).length,
          },
        });
      } catch (analysisError) {
        document.status = 'failed';
        document.error = analysisError instanceof Error ? analysisError.message : 'Unknown error';
        await document.save();
        throw analysisError;
      }
    } catch (error) {
      console.error('Analysis error:', error);
      res.status(500).json({ error: 'Analysis failed' });
    }
  }

  static async humanizeDocument(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { documentId } = req.params;
      const { style = 'formal', sections } = req.body as {
        style: RewriteStyle;
        sections?: string[];
      };

      const document = await Document.findById(documentId);

      if (!document) {
        res.status(404).json({ error: 'Document not found' });
        return;
      }

      if (document.userId.toString() !== req.userId) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      document.status = 'processing';
      await document.save();

      try {
        let textToHumanize = document.extractedText;

        if (sections && sections.length > 0) {
          textToHumanize = sections.join('\n');
        }

        const humanizationResult = await HumanizationService.humanizeText(
          textToHumanize,
          style
        );

        if (!document.analysis) {
          document.analysis = {
            aiScore: 0,
            plagiarismScore: 0,
            humanizedText: '',
            flaggedSections: [],
            originalWordCount: 0,
            humanizedWordCount: 0
          };
        }

        (document.analysis as any).humanizedText =
          humanizationResult.humanizedText;
        (document.analysis as any).originalWordCount =
          humanizationResult.originalWordCount;
        (document.analysis as any).humanizedWordCount =
          humanizationResult.humanizedWordCount;
        (document.analysis as any).rewriteStyle = style;

        document.status = 'completed';
        await document.save();

        res.json({
          message: 'Humanization completed',
          result: {
            originalText: textToHumanize,
            humanizedText: humanizationResult.humanizedText,
            originalWordCount: humanizationResult.originalWordCount,
            humanizedWordCount: humanizationResult.humanizedWordCount,
            style,
            readabilityScore: HumanizationService.calculateReadabilityScore(
              humanizationResult.humanizedText
            ),
          },
        });
      } catch (humanizeError) {
        document.status = 'failed';
        document.error =
          humanizeError instanceof Error ? humanizeError.message : 'Unknown error';
        await document.save();
        throw humanizeError;
      }
    } catch (error) {
      console.error('Humanization error:', error);
      res.status(500).json({ error: 'Humanization failed' });
    }
  }

  static async getDocument(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { documentId } = req.params;

      const document = await Document.findById(documentId);

      if (!document) {
        res.status(404).json({ error: 'Document not found' });
        return;
      }

      if (document.userId.toString() !== req.userId) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      res.json({
        document: {
          id: document._id,
          originalName: document.originalName,
          fileSize: document.fileSize,
          status: document.status,
          createdAt: document.createdAt,
          extractedText: document.extractedText,
          analysis: document.analysis,
        },
      });
    } catch (error) {
      console.error('Get document error:', error);
      res.status(500).json({ error: 'Failed to get document' });
    }
  }

  static async listDocuments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const documents = await Document.find({ userId: req.userId })
        .sort({ createdAt: -1 })
        .limit(50);

      res.json({
        documents: documents.map((doc) => ({
          id: doc._id,
          originalName: doc.originalName,
          fileSize: doc.fileSize,
          status: doc.status,
          createdAt: doc.createdAt,
          analysis: doc.analysis ? {
            aiScore: (doc.analysis as any).aiScore,
            plagiarismScore: (doc.analysis as any).plagiarismScore,
          } : null,
        })),
      });
    } catch (error) {
      console.error('List documents error:', error);
      res.status(500).json({ error: 'Failed to list documents' });
    }
  }

  static async deleteDocument(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { documentId } = req.params;

      const document = await Document.findById(documentId);

      if (!document) {
        res.status(404).json({ error: 'Document not found' });
        return;
      }

      if (document.userId.toString() !== req.userId) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      // Delete file
      const filePath = path.join(config.uploadDir, document.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await Document.findByIdAndDelete(documentId);

      res.json({ message: 'Document deleted successfully' });
    } catch (error) {
      console.error('Delete document error:', error);
      res.status(500).json({ error: 'Failed to delete document' });
    }
  }
}

export default DocumentController;
