import jwt, { SignOptions } from 'jsonwebtoken';
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
  const days = parseInt(process.env.JWT_EXPIRES_DAYS ?? '7', 10) || 7;
  const options: SignOptions = { expiresIn: days * 24 * 60 * 60 };
  return jwt.sign(payload, secret, options);
}
