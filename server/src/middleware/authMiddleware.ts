import { Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt.js';
import { RepositoryFactory } from '../repositories/factory.js';
import { AppError } from './errorHandler.js';
import { AuthRequest } from '../types/index.js';
import { logger } from '../utils/logger.js';

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      throw new AppError('No token provided. Please login', 401);
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      throw new AppError('Invalid or expired token. Please login again', 401);
    }

    const userRepo = RepositoryFactory.getUserRepository();
    const user = await userRepo.findById(payload.userId);
    if (!user) {
      throw new AppError('User not found', 401);
    }

    if (!user.is_active) {
      throw new AppError('Account is deactivated', 403);
    }

    const { password_hash, ...userResponse } = user;
    req.user = { ...userResponse, role: userResponse.role as any };

    next();
  } catch (error) {
    next(error);
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Access denied for user ${req.user.email} with role ${req.user.role}`);
      throw new AppError('You do not have permission to perform this action', 403);
    }

    next();
  };
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const payload = verifyAccessToken(token);
      if (payload) {
        const userRepo = RepositoryFactory.getUserRepository();
        const user = await userRepo.findById(payload.userId);
        if (user && user.is_active) {
          const { password_hash, ...userResponse } = user;
          req.user = { ...userResponse, role: userResponse.role as any };
        }
      }
    }

    next();
  } catch (error) {
    next();
  }
};
