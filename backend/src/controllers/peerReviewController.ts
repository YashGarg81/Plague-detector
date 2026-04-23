import { Response } from 'express';
import PeerReview from '../models/PeerReview';
import Document from '../models/Document';
import Assignment from '../models/Assignment';
import { AuthRequest } from '../middleware/auth';

export class PeerReviewController {
  static async assignReview(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { assignmentId } = req.params;
      const { reviewerId, revieweeDocumentId } = req.body as {
        reviewerId: string;
        revieweeDocumentId: string;
      };

      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
        res.status(404).json({ error: 'Assignment not found' });
        return;
      }

      if (assignment.createdBy.toString() !== req.userId) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      const document = await Document.findById(revieweeDocumentId);
      if (!document) {
        res.status(404).json({ error: 'Reviewee document not found' });
        return;
      }

      const review = await PeerReview.create({
        assignmentId,
        reviewerId,
        revieweeDocumentId,
        status: 'assigned',
      });

      res.status(201).json({ message: 'Peer review assigned', review });
    } catch (error) {
      console.error('Assign peer review error:', error);
      res.status(500).json({ error: 'Failed to assign peer review' });
    }
  }

  static async listAssignmentReviews(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { assignmentId } = req.params;
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
        res.status(404).json({ error: 'Assignment not found' });
        return;
      }

      if (assignment.createdBy.toString() !== req.userId) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      const reviews = await PeerReview.find({ assignmentId })
        .populate('reviewerId', 'username email')
        .populate('revieweeDocumentId', 'originalName createdAt');

      res.json({ reviews });
    } catch (error) {
      console.error('List peer reviews error:', error);
      res.status(500).json({ error: 'Failed to list peer reviews' });
    }
  }

  static async submitReview(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { reviewId } = req.params;
      const { comments = [], rubricScores = [] } = req.body as {
        comments: Array<{ text: string; startIndex: number; endIndex: number }>;
        rubricScores: Array<{ criterionTitle: string; score: number; maxPoints: number }>;
      };

      const review = await PeerReview.findById(reviewId);
      if (!review) {
        res.status(404).json({ error: 'Review not found' });
        return;
      }

      if (review.reviewerId.toString() !== req.userId) {
        res.status(403).json({ error: 'Only assigned reviewer can submit' });
        return;
      }

      review.comments = comments;
      review.rubricScores = rubricScores;
      review.status = 'submitted';
      review.submittedAt = new Date();
      await review.save();

      res.json({ message: 'Peer review submitted', review });
    } catch (error) {
      console.error('Submit peer review error:', error);
      res.status(500).json({ error: 'Failed to submit peer review' });
    }
  }
}

export default PeerReviewController;
