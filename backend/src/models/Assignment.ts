import mongoose, { Document, Schema } from 'mongoose';

export interface RubricCriterion {
  title: string;
  description?: string;
  maxPoints: number;
}

export interface IAssignment extends Document {
  title: string;
  course: string;
  instructions?: string;
  dueDate?: Date;
  allowResubmission: boolean;
  groupAssignment: boolean;
  maxGroupSize?: number;
  quickMarksLibrary: string[];
  rubric: RubricCriterion[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const rubricCriterionSchema = new Schema<RubricCriterion>(
  {
    title: { type: String, required: true },
    description: { type: String, default: undefined },
    maxPoints: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const assignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true },
    instructions: { type: String, default: undefined },
    dueDate: { type: Date, default: undefined },
    allowResubmission: { type: Boolean, default: false },
    groupAssignment: { type: Boolean, default: false },
    maxGroupSize: { type: Number, default: undefined, min: 1 },
    quickMarksLibrary: { type: [String], default: [] },
    rubric: { type: [rubricCriterionSchema], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

assignmentSchema.index({ createdBy: 1, createdAt: -1 });

export default mongoose.model<IAssignment>('Assignment', assignmentSchema);
