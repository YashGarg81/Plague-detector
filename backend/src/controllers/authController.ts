import { Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import config from '../config/environment';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  static async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { username, email, password, confirmPassword } = req.body;
      const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
      const normalizedUsername = typeof username === 'string' ? username.trim() : '';

      // Validation
      if (!normalizedUsername || !normalizedEmail || !password) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      if (password !== confirmPassword) {
        res.status(400).json({ error: 'Passwords do not match' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters' });
        return;
      }

      // Check if user exists
      const existingUser = await User.findOne({
        $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
      });

      if (existingUser) {
        res.status(409).json({ error: 'User already exists' });
        return;
      }

      // Create user
      const user = new User({
        username: normalizedUsername,
        email: normalizedEmail,
        password,
      });
      await user.save();

      // Generate token
      const token: string = (jwt.sign as any)(
        { userId: user._id, username: user.username },
        config.jwtSecret as string,
        { expiresIn: config.jwtExpiry }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      if ((error as any).code === 11000) {
        res.status(409).json({ error: 'User already exists' });
        return;
      }
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  static async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

      if (!normalizedEmail || !password) {
        res.status(400).json({ error: 'Email and password required' });
        return;
      }

      const user = await User.findOne({ email: normalizedEmail }).select('+password');

      if (!user || !(await user.comparePassword(password))) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token: string = (jwt.sign as any)(
        { userId: user._id, username: user.username },
        config.jwtSecret as string,
        { expiresIn: config.jwtExpiry }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  static async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await User.findById(req.userId);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Failed to get user' });
    }
  }
}

export default AuthController;
