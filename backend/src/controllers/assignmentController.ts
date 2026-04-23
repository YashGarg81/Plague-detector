import { Response } from 'express';
import Assignment from '../models/Assignment';
import { AuthRequest } from '../middleware/auth';

export class AssignmentController {
  static async createAssignment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const assignment = await Assignment.create({
        ...req.body,
        createdBy: req.userId,
      });

      res.status(201).json({ message: 'Assignment created', assignment });
    } catch (error) {
      console.error('Create assignment error:', error);
      res.status(500).json({ error: 'Failed to create assignment' });
    }
  }

  static async listAssignments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const assignments = await Assignment.find({ createdBy: req.userId }).sort({ createdAt: -1 });
      res.json({ assignments });
    } catch (error) {
      console.error('List assignments error:', error);
      res.status(500).json({ error: 'Failed to list assignments' });
    }
  }

  static async getAssignment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const assignment = await Assignment.findById(req.params.assignmentId);
      if (!assignment) {
        res.status(404).json({ error: 'Assignment not found' });
        return;
      }

      if (assignment.createdBy.toString() !== req.userId) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      res.json({ assignment });
    } catch (error) {
      console.error('Get assignment error:', error);
      res.status(500).json({ error: 'Failed to get assignment' });
    }
  }

  static async updateAssignment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const assignment = await Assignment.findById(req.params.assignmentId);
      if (!assignment) {
        res.status(404).json({ error: 'Assignment not found' });
        return;
      }

      if (assignment.createdBy.toString() !== req.userId) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      Object.assign(assignment, req.body);
      await assignment.save();

      res.json({ message: 'Assignment updated', assignment });
    } catch (error) {
      console.error('Update assignment error:', error);
      res.status(500).json({ error: 'Failed to update assignment' });
    }
  }

  static async deleteAssignment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const assignment = await Assignment.findById(req.params.assignmentId);
      if (!assignment) {
        res.status(404).json({ error: 'Assignment not found' });
        return;
      }

      if (assignment.createdBy.toString() !== req.userId) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      await Assignment.findByIdAndDelete(req.params.assignmentId);
      res.json({ message: 'Assignment deleted' });
    } catch (error) {
      console.error('Delete assignment error:', error);
      res.status(500).json({ error: 'Failed to delete assignment' });
    }
  }
}

export default AssignmentController;
