import express, { Request, Response } from 'express';
import Movie from '../models/Movie';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { genre, language, search } = req.query;
    const query: Record<string, unknown> = { isActive: true };

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
  })
);

router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      throw new AppError('Movie not found', 404);
    }
    res.json(movie);
  })
);

export default router;
