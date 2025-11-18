import { Request, Response } from 'express';
import { UserModel } from '../models/User.js';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { LoginRequest, RegisterRequest, AuthRequest } from '../types/index.js';
import { logger } from '../utils/logger.js';

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, full_name, phone, role }: RegisterRequest = req.body;

  // Validate required fields
  if (!email || !password || !full_name) {
    throw new AppError('Email, password, and full name are required', 400);
  }

  // Check if user already exists
  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  // Create new user
  const user = await UserModel.create({ email, password, full_name, phone, role });

  // Generate tokens
  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  logger.info(`New user registered: ${email}`);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: UserModel.toResponse(user),
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

  // Validate required fields
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  // Find user
  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check if user is active
  if (!user.is_active) {
    throw new AppError('Account is deactivated. Please contact administrator', 403);
  }

  // Verify password
  const isPasswordValid = await UserModel.verifyPassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate tokens
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
      user: UserModel.toResponse(user),
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

  // Verify refresh token
  const payload = verifyRefreshToken(token);
  if (!payload) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  // Check if user still exists and is active
  const user = await UserModel.findById(payload.userId);
  if (!user || !user.is_active) {
    throw new AppError('User not found or inactive', 401);
  }

  // Generate new tokens
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

  // Fetch fresh user data
  const user = await UserModel.findById(req.user.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      user: UserModel.toResponse(user),
    },
  });
});

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  // In a stateless JWT setup, logout is handled client-side by removing the token
  // Optionally, you can implement token blacklisting here

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

  // Get user with password
  const user = await UserModel.findById(req.user.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isPasswordValid = await UserModel.verifyPassword(currentPassword, user.password_hash);
  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect', 401);
  }

  // Change password
  await UserModel.changePassword(user.id, newPassword);

  logger.info(`Password changed for user: ${user.email}`);

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});
