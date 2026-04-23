import mongoose, { Schema, Document } from 'mongoose';

export interface AnalysisResult {
  aiScore: number;
  plagiarismScore: number;
  similarityScore?: number;
  confidence?: number;
  reportGeneratedInMs?: number;
  humanizedText: string;
  flaggedSections: Array<{
    text: string;
    startIndex: number;
    endIndex: number;
    type: 'ai-generated' | 'plagiarism';
    color?: 'red' | 'yellow' | 'blue';
    confidence: number;
  }>;
  sourceMatches?: Array<{
    sourceType: 'website' | 'journal' | 'student-paper';
    sourceName: string;
    matchPercentage: number;
    matchedText: string;
  }>;
  matchedContentBreakdown?: {
    websites: number;
    journals: number;
    studentPapers: number;
  };
  filters?: {
    excludeQuotes: boolean;
    excludeBibliography: boolean;
    excludeSmallMatchesUnderWords: number;
  };
  writingAnalysis?: {
    paraphrasingLikelihood: number;
    writingPatternConsistency: number;
    grammarRisk: number;
    structureRisk: number;
  };
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
  assignmentId?: mongoose.Types.ObjectId;
  assignment?: {
    title?: string;
    course?: string;
    dueDate?: Date;
    allowResubmission?: boolean;
    isGroupAssignment?: boolean;
  };
  collaboration?: {
    peerReviewEnabled?: boolean;
    groupId?: string;
  };
  grading?: {
    rubricScore?: number;
    quickMarks?: string[];
    inlineComments?: Array<{
      text: string;
      startIndex: number;
      endIndex: number;
    }>;
    audioFeedbackUrl?: string;
  };
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
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      default: undefined,
    },
    assignment: {
      type: Schema.Types.Mixed,
      default: null,
    },
    collaboration: {
      type: Schema.Types.Mixed,
      default: null,
    },
    grading: {
      type: Schema.Types.Mixed,
      default: null,
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
