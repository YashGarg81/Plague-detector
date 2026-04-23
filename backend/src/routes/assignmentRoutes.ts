import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { AssignmentController } from '../controllers/assignmentController';

const router = Router();

router.post('/', authenticate, requireRole(['teacher']), AssignmentController.createAssignment);
router.get('/', authenticate, requireRole(['teacher']), AssignmentController.listAssignments);
router.get('/:assignmentId', authenticate, requireRole(['teacher']), AssignmentController.getAssignment);
router.put('/:assignmentId', authenticate, requireRole(['teacher']), AssignmentController.updateAssignment);
router.delete('/:assignmentId', authenticate, requireRole(['teacher']), AssignmentController.deleteAssignment);

export default router;
