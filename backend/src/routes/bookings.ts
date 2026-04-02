import express, { Request, Response } from 'express';
import Booking from '../models/Booking';
import Show from '../models/Show';
import { body, validationResult } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { validateObjectId } from '../middleware/validateObjectId';
import { authenticate } from '../middleware/authenticate';

const router = express.Router();

router.post(
  '/',
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('showId').notEmpty().withMessage('Show ID is required'),
    body('seats').isArray({ min: 1 }).withMessage('At least one seat is required'),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, showId, seats } = req.body;

    const show = await Show.findById(showId);
    if (!show) {
      throw new AppError('Show not found', 404);
    }

    if (!show.isActive) {
      throw new AppError('Show is not active', 400);
    }

    if (new Date(show.showTime) < new Date()) {
      throw new AppError('Show time has passed', 400);
    }

    const existingBookings = await Booking.find({
      show: showId,
      status: { $in: ['pending', 'confirmed'] },
    });

    const bookedSeats = new Set<string>();
    existingBookings.forEach((booking) => {
      booking.seats.forEach((seat) => {
        bookedSeats.add(`${seat.row}-${seat.number}`);
      });
    });

    let totalAmount = 0;
    const seatMap = show.seatMap;

    for (const seatSelection of seats) {
      const seatKey = `${seatSelection.row}-${seatSelection.number}`;

      if (bookedSeats.has(seatKey)) {
        throw new AppError(
          `Seat ${seatSelection.row}${seatSelection.number} is already booked`,
          400
        );
      }

      let seatFound = false;
      for (const row of seatMap) {
        const seat = row.find(
          (s) => s.row === seatSelection.row && s.number === seatSelection.number
        );
        if (seat) {
          seatFound = true;
          if (seat.type !== seatSelection.type) {
            throw new AppError(
              `Seat type mismatch for ${seatSelection.row}${seatSelection.number}`,
              400
            );
          }
          totalAmount += seat.price;
          break;
        }
      }

      if (!seatFound) {
        throw new AppError(
          `Seat ${seatSelection.row}${seatSelection.number} not found`,
          400
        );
      }
    }

    if (show.availableSeats < seats.length) {
      throw new AppError('Not enough seats available', 400);
    }

    const booking = new Booking({
      user: userId,
      show: showId,
      seats,
      totalAmount,
      status: 'confirmed',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    await booking.save();

    show.availableSeats -= seats.length;
    await show.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .populate('show', 'showTime screen');

    res.status(201).json(populatedBooking);
  })
);

router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const bookings = await Booking.find({ user: req.userId })
      .sort({ bookingDate: -1 })
      .populate('user', 'name email phone')
      .populate({
        path: 'show',
        populate: {
          path: 'movie',
          select: 'title posterUrl duration',
        },
      });

    res.json(bookings);
  })
);

router.get(
  '/:id',
  validateObjectId('id'),
  asyncHandler(async (req: Request, res: Response) => {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate({
        path: 'show',
        populate: {
          path: 'movie',
          select: 'title posterUrl duration',
        },
      });

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    res.json(booking);
  })
);

export default router;
