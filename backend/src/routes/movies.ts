import express, { Request, Response } from 'express';
import Movie from '../models/Movie';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { validateObjectId } from '../middleware/validateObjectId';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { genre, language, search, page: pageRaw, limit: limitRaw } = req.query;
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

    const page = Math.max(1, parseInt(String(pageRaw ?? '1'), 10) || 1);
    const limit = Math.min(48, Math.max(1, parseInt(String(limitRaw ?? '12'), 10) || 12));
    const skip = (page - 1) * limit;

    const [total, movies] = await Promise.all([
      Movie.countDocuments(query),
      Movie.find(query).sort({ releaseDate: -1 }).skip(skip).limit(limit),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    res.json({
      data: movies,
      page,
      limit,
      total,
      totalPages,
    });
  })
);

router.get(
  '/:id',
  validateObjectId('id'),
  asyncHandler(async (req: Request, res: Response) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      throw new AppError('Movie not found', 404);
    }
    res.json(movie);
  })
);

export default router;
