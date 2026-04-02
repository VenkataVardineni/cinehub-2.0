import express, { Request, Response } from 'express';
import User from '../models/User';
import { body, validationResult } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { validateObjectId } from '../middleware/validateObjectId';

const router = express.Router();

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array().map((e) => e.msg).join(', '),
        errors: errors.array(),
      });
    }

    const { name, email, phone, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (name && existingUser.name !== name) {
        existingUser.name = name;
      }
      if (phone && existingUser.phone !== phone) {
        existingUser.phone = phone;
      }
      await existingUser.save();
      return res.status(200).json(existingUser);
    }

    const user = new User({
      name,
      email,
      phone,
      role: role || 'user',
    });

    try {
      await user.save();
    } catch (e: unknown) {
      const code = (e as { code?: number })?.code;
      if (code === 11000) {
        throw new AppError('User with this email already exists', 400);
      }
      throw e;
    }
    res.status(201).json(user);
  })
);

router.get(
  '/:id',
  validateObjectId('id'),
  asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    res.json(user);
  })
);

export default router;
