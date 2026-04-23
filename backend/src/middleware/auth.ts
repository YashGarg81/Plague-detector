import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/environment';

export interface AuthRequest extends Request {
  user?: any;
  userId?: string;
  userRole?: 'student' | 'teacher';
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    req.userId = (decoded as any).userId;
    req.userRole = (decoded as any).role;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = decoded;
      req.userId = (decoded as any).userId;
      req.userRole = (decoded as any).role;
    }
  } catch (error) {
    // Continue without authentication
  }
  next();
};

export const requireRole = (roles: Array<'student' | 'teacher'>) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.userRole) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!roles.includes(req.userRole)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};
