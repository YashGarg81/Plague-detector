import mongoose, { Schema, Document } from 'mongoose';

export interface AnalysisResult {
  aiScore: number;
  plagiarismScore: number;
  humanizedText: string;
  flaggedSections: Array<{
    text: string;
    startIndex: number;
    endIndex: number;
    type: 'ai-generated' | 'plagiarism';
    confidence: number;
  }>;
  rewriteStyle?: 'formal' | 'simplified' | 'scholarly';
  originalWordCount: number;
  humanizedWordCount: number;
}

export interface IDocument extends Document {
  userId: mongoose.Types.ObjectId;
  filename: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  extractedText: string;
  analysis: AnalysisResult | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    extractedText: {
      type: String,
      required: true,
    },
    analysis: {
      type: Schema.Types.Mixed,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    error: {
      type: String,
      default: undefined,
    },
  },
  { timestamps: true }
);

// Index for faster queries
documentSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IDocument>('Document', documentSchema);
