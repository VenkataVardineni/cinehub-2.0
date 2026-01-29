import express, { Request, Response } from 'express';
import User from '../models/User';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Create or get a user by email
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
        return res.status(400).json({ 
          error: errors.array().map(e => e.msg).join(', '),
          errors: errors.array() 
        });
      }

      const { name, email, phone, role } = req.body;

      // Check if user already exists - if yes, return existing user (allow multiple bookings)
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        // Update user info if provided (in case phone or name changed)
        if (name && existingUser.name !== name) {
          existingUser.name = name;
        }
        if (phone && existingUser.phone !== phone) {
          existingUser.phone = phone;
        }
        await existingUser.save();
        return res.status(200).json(existingUser);
      }

      // Create new user if doesn't exist
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

