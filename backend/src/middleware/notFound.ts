import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction): void {
  next(new AppError('Resource not found', 404));
}
