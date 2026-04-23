import mongoose, { Document, Schema } from 'mongoose';

export interface IPeerReview extends Document {
  assignmentId: mongoose.Types.ObjectId;
  reviewerId: mongoose.Types.ObjectId;
  revieweeDocumentId: mongoose.Types.ObjectId;
  status: 'assigned' | 'submitted';
  comments: Array<{
    text: string;
    startIndex: number;
    endIndex: number;
  }>;
  rubricScores: Array<{
    criterionTitle: string;
    score: number;
    maxPoints: number;
  }>;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const peerReviewSchema = new Schema<IPeerReview>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    reviewerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    revieweeDocumentId: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    status: {
      type: String,
      enum: ['assigned', 'submitted'],
      default: 'assigned',
    },
    comments: {
      type: [
        {
          text: { type: String, required: true },
          startIndex: { type: Number, required: true, min: 0 },
          endIndex: { type: Number, required: true, min: 0 },
        },
      ],
      default: [],
    },
    rubricScores: {
      type: [
        {
          criterionTitle: { type: String, required: true },
          score: { type: Number, required: true, min: 0 },
          maxPoints: { type: Number, required: true, min: 0 },
        },
      ],
      default: [],
    },
    submittedAt: { type: Date, default: undefined },
  },
  { timestamps: true }
);

peerReviewSchema.index({ assignmentId: 1, reviewerId: 1 });
peerReviewSchema.index({ revieweeDocumentId: 1 });

export default mongoose.model<IPeerReview>('PeerReview', peerReviewSchema);
