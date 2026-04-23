import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { PeerReviewController } from '../controllers/peerReviewController';

const router = Router();

router.post('/assignments/:assignmentId', authenticate, PeerReviewController.assignReview);
router.get('/assignments/:assignmentId', authenticate, PeerReviewController.listAssignmentReviews);
router.post('/:reviewId/submit', authenticate, PeerReviewController.submitReview);

export default router;
