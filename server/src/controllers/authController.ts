import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserService } from '../services/UserService.js';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { LoginRequest, RegisterRequest, AuthRequest } from '../types/index.js';
import { logger } from '../utils/logger.js';

const userService = new UserService();

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const data: RegisterRequest = req.body;

  if (!data.email || !data.password || !data.full_name) {
    throw new AppError('Email, password, and full name are required', 400);
  }

  const user = await userService.registerUser(data);

  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  logger.info(`New user registered: ${data.email}`);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      ...tokens,
    },
  });
});

/**
 * Login user
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: LoginRequest = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.is_active) {
    throw new AppError('Account is deactivated. Please contact administrator', 403);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  logger.info(`User logged in: ${email}`);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: userService.toResponse(user),
      ...tokens,
    },
  });
});

/**
 * Refresh access token
 * POST /api/auth/refresh-token
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw new AppError('Refresh token is required', 400);
  }

  const payload = verifyRefreshToken(token);
  if (!payload) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const user = await userService.getUserById(payload.userId);
  if (!user || !user.is_active) {
    throw new AppError('User not found or inactive', 401);
  }

  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: tokens,
  });
});

/**
 * Get current user
 * GET /api/auth/me
 */
export const getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const user = await userService.getUserById(req.user.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  logger.info(`User logged out: ${req.user?.email}`);

  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
});

/**
 * Change password
 * POST /api/auth/change-password
 */
export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (!currentPassword || !newPassword) {
    throw new AppError('Current password and new password are required', 400);
  }

  if (newPassword.length < 6) {
    throw new AppError('New password must be at least 6 characters long', 400);
  }

  const user = await userService.getUserByEmail(req.user.email);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect', 401);
  }

  const saltRounds = 10;
  const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

  const repository = new UserService();
  // Call repository directly to update password
  const userRepo = (repository as any).userRepo;
  await userRepo.changePassword(user.id, newPasswordHash);

  logger.info(`Password changed for user: ${user.email}`);

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});
