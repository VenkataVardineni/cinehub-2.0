import express, { Request, Response } from 'express';
import User from '../models/User';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Create a new user
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, phone, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      const user = new User({
        name,
        email,
        phone,
        role: role || 'user',
      });

      await user.save();
      res.status(201).json(user);
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  }
);

// Get user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

