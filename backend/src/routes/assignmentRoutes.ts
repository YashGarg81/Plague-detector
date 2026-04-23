import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { AssignmentController } from '../controllers/assignmentController';

const router = Router();

router.post('/', authenticate, AssignmentController.createAssignment);
router.get('/', authenticate, AssignmentController.listAssignments);
router.get('/:assignmentId', authenticate, AssignmentController.getAssignment);
router.put('/:assignmentId', authenticate, AssignmentController.updateAssignment);
router.delete('/:assignmentId', authenticate, AssignmentController.deleteAssignment);

export default router;
