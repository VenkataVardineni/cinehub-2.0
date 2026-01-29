import express, { Request, Response } from 'express';
import Booking from '../models/Booking';
import Show from '../models/Show';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Create a new booking with seat lock logic
router.post(
  '/',
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('showId').notEmpty().withMessage('Show ID is required'),
    body('seats').isArray({ min: 1 }).withMessage('At least one seat is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId, showId, seats } = req.body;

      // Get the show
      const show = await Show.findById(showId);
      if (!show) {
        return res.status(404).json({ error: 'Show not found' });
      }

      // Check if show is active
      if (!show.isActive) {
        return res.status(400).json({ error: 'Show is not active' });
      }

      // Check if show time has passed
      if (new Date(show.showTime) < new Date()) {
        return res.status(400).json({ error: 'Show time has passed' });
      }

      // Check for existing bookings for the same seats
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

      // Validate seats and calculate total amount
      let totalAmount = 0;
      const seatMap = show.seatMap;

      for (const seatSelection of seats) {
        const seatKey = `${seatSelection.row}-${seatSelection.number}`;

        // Check if seat is already booked
        if (bookedSeats.has(seatKey)) {
          return res.status(400).json({
            error: `Seat ${seatSelection.row}${seatSelection.number} is already booked`,
          });
        }

        // Find seat in seat map and validate
        let seatFound = false;
        for (const row of seatMap) {
          const seat = row.find(
            (s) => s.row === seatSelection.row && s.number === seatSelection.number
          );
          if (seat) {
            seatFound = true;
            if (seat.type !== seatSelection.type) {
              return res.status(400).json({
                error: `Seat type mismatch for ${seatSelection.row}${seatSelection.number}`,
              });
            }
            totalAmount += seat.price;
            break;
          }
        }

        if (!seatFound) {
          return res.status(400).json({
            error: `Seat ${seatSelection.row}${seatSelection.number} not found`,
          });
        }
      }

      // Check if enough seats are available
      if (show.availableSeats < seats.length) {
        return res.status(400).json({ error: 'Not enough seats available' });
      }

      // Create booking with confirmed status
      const booking = new Booking({
        user: userId,
        show: showId,
        seats,
        totalAmount,
        status: 'confirmed', // Changed to confirmed immediately
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      });

      await booking.save();

      // Update available seats count
      show.availableSeats -= seats.length;
      await show.save();

      const populatedBooking = await Booking.findById(booking._id)
        .populate('user', 'name email')
        .populate('show', 'showTime screen');

      res.status(201).json(populatedBooking);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get booking by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
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
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

