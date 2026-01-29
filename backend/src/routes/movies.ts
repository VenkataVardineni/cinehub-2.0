import express, { Request, Response } from 'express';
import Movie from '../models/Movie';

const router = express.Router();

// Get all movies with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { genre, language, search } = req.query;
    const query: any = { isActive: true };

    if (genre) {
      query.genre = { $in: Array.isArray(genre) ? genre : [genre] };
    }

    if (language) {
      query.language = language;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const movies = await Movie.find(query).sort({ releaseDate: -1 });
    res.json(movies);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get movie by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

