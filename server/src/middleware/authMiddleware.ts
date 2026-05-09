// @ts-nocheck
import { Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt.js';
import { UserModel } from '../models/User.js';
import { AppError } from './errorHandler.js';
import { AuthRequest } from '../types/index.js';
import { logger } from '../utils/logger.js';

/**
 * Middleware to protect routes - requires authentication
 */
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      throw new AppError('No token provided. Please login', 401);
    }

    // Verify token
    const payload = verifyAccessToken(token);
    if (!payload) {
      throw new AppError('Invalid or expired token. Please login again', 401);
    }

    // Get user from database
    const user = await UserModel.findById(payload.userId);
    if (!user) {
      throw new AppError('User not found', 401);
    }

    // Check if user is active
    if (!user.is_active) {
      throw new AppError('Account is deactivated', 403);
    }

    // Attach user to request
    req.user = UserModel.toResponse(user);

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to restrict routes to specific roles
 */
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

/**
 * Optional authentication - attaches user if token is valid, but doesn't require it
 */
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
        const user = await UserModel.findById(payload.userId);
        if (user && user.is_active) {
          req.user = UserModel.toResponse(user);
        }
      }
    }

    next();
  } catch (error) {
    // If there's an error, just continue without user
    next();
  }
};
