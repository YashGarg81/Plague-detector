import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { PeerReviewController } from '../controllers/peerReviewController';

const router = Router();

router.post('/assignments/:assignmentId', authenticate, requireRole(['teacher']), PeerReviewController.assignReview);
router.get('/assignments/:assignmentId', authenticate, requireRole(['teacher']), PeerReviewController.listAssignmentReviews);
router.post('/:reviewId/submit', authenticate, PeerReviewController.submitReview);

export default router;
