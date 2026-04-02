import express, { Request, Response } from 'express';
import Movie from '../models/Movie';
import Show from '../models/Show';
import Booking from '../models/Booking';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.get(
  '/summary',
  asyncHandler(async (_req: Request, res: Response) => {
    const now = new Date();
    const [activeMovies, upcomingShows, confirmedBookings] = await Promise.all([
      Movie.countDocuments({ isActive: true }),
      Show.countDocuments({ isActive: true, showTime: { $gte: now } }),
      Booking.countDocuments({ status: 'confirmed' }),
    ]);

    res.json({
      activeMovies,
      upcomingShows,
      confirmedBookings,
    });
  })
);

export default router;
