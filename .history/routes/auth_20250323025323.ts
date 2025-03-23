import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { verifyToken } from '../middleware/auth';
import { DEFAULT_ADMIN } from './config/constants';

const router = express.Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      name
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check for default admin login first
    if (email === DEFAULT_ADMIN.email && password === 'admin123') {
      const token = jwt.sign(
        { userId: DEFAULT_ADMIN.id, role: DEFAULT_ADMIN.role },
        process.env.JWT_SECRET || 'mdx-64649',
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: DEFAULT_ADMIN
      });
    }

    // Regular user login
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        role: user.role, 
        name: user.name 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', verifyToken, async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Handle default admin case
    if (req.user.userId === DEFAULT_ADMIN.id) {
      return res.json(DEFAULT_ADMIN);
    }
    
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;



