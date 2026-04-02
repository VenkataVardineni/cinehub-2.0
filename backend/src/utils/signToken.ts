import jwt from 'jsonwebtoken';
import { AppError } from './AppError';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export function signToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError('Authentication is not configured on the server', 500, false);
  }
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}
