import { Request, Response, NextFunction, RequestHandler } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../utils/AppError';

export function validateObjectId(param = 'id'): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const value = req.params[param];
    if (!value || !mongoose.isValidObjectId(value)) {
      next(new AppError('Invalid id format', 400));
      return;
    }
    next();
  };
}
