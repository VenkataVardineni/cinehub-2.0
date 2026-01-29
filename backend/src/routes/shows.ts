import express, { Request, Response } from 'express';
import Show from '../models/Show';
import Movie from '../models/Movie';

const router = express.Router();

// Get shows for a specific movie
router.get('/movie/:movieId', async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;
    const { date } = req.query;

    const query: any = {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get show by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const show = await Show.findById(req.params.id).populate(
      'movie',
      'title posterUrl duration description genre'
    );
    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }
    res.json(show);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

