import express, { Request, Response } from 'express';
import Show from '../models/Show';
import Booking from '../models/Booking';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

const router = express.Router();

router.get(
  '/movie/:movieId',
  asyncHandler(async (req: Request, res: Response) => {
    const { movieId } = req.params;
    const { date } = req.query;

    const query: Record<string, unknown> = {
      movie: movieId,
      isActive: true,
      showTime: { $gte: new Date() },
    };

    if (date) {
      const startDate = new Date(date as string);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
      query.showTime = { $gte: startDate, $lte: endDate };
    }

    const shows = await Show.find(query)
      .populate('movie', 'title posterUrl duration')
      .sort({ showTime: 1 });

    res.json(shows);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const show = await Show.findById(req.params.id).populate(
      'movie',
      'title posterUrl duration description genre'
    );
    if (!show) {
      throw new AppError('Show not found', 404);
    }
    res.json(show);
  })
);

router.get(
  '/:id/booked-seats',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const bookings = await Booking.find({
      show: id,
      status: { $in: ['pending', 'confirmed'] },
    });

    const bookedSeats = new Set<string>();
    bookings.forEach((booking) => {
      booking.seats.forEach((seat) => {
        bookedSeats.add(`${seat.row}-${seat.number}`);
      });
    });

    res.json({ bookedSeats: Array.from(bookedSeats) });
  })
);

export default router;
