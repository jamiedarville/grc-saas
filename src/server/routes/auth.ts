import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import db from '../database/connection';
import { User, UserRole } from '../../shared/types';

const router = Router();

// Register new user
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, organizationId } = req.body;

  // Validate required fields
  if (!email || !password || !firstName || !lastName) {
    throw createError('All fields are required', 400);
  }

  // Check if user already exists
  const existingUser = await db('users').where({ email }).first();
  if (existingUser) {
    throw createError('User already exists with this email', 409);
  }

  // Hash password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  const [userId] = await db('users').insert({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    role: UserRole.USER,
    organizationId,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Fetch created user
  const user = await db('users').where({ id: userId }).first();
  
  // Generate token
  const token = generateToken(user);

  logger.info(`User registered: ${email}`);

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organizationId: user.organizationId
      },
      token
    },
    message: 'User registered successfully'
  });
}));

// Login user
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    throw createError('Email and password are required', 400);
  }

  // Find user
  const user = await db('users').where({ email }).first();
  if (!user) {
    throw createError('Invalid credentials', 401);
  }

  // Check if user is active
  if (!user.isActive) {
    throw createError('Account is deactivated', 401);
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw createError('Invalid credentials', 401);
  }

  // Update last login
  await db('users').where({ id: user.id }).update({
    lastLogin: new Date(),
    updatedAt: new Date()
  });

  // Generate token
  const token = generateToken(user);

  logger.info(`User logged in: ${email}`);

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organizationId: user.organizationId
      },
      token
    },
    message: 'Login successful'
  });
}));

// Refresh token
router.post('/refresh', asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    throw createError('Token is required', 400);
  }

  try {
    // Verify and decode token
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Find user
    const user = await db('users').where({ id: decoded.userId }).first();
    if (!user || !user.isActive) {
      throw createError('User not found or inactive', 401);
    }

    // Generate new token
    const newToken = generateToken(user);

    res.json({
      success: true,
      data: {
        token: newToken
      },
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    throw createError('Invalid token', 401);
  }
}));

// Forgot password
router.post('/forgot-password', asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw createError('Email is required', 400);
  }

  // Find user
  const user = await db('users').where({ email }).first();
  if (!user) {
    // Don't reveal if email exists or not
    res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent'
    });
    return;
  }

  // In a real application, you would:
  // 1. Generate a password reset token
  // 2. Store it in the database with expiration
  // 3. Send email with reset link
  
  logger.info(`Password reset requested for: ${email}`);

  res.json({
    success: true,
    message: 'If the email exists, a password reset link has been sent'
  });
}));

// Reset password
router.post('/reset-password', asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw createError('Token and new password are required', 400);
  }

  // In a real application, you would:
  // 1. Verify the reset token
  // 2. Check if it's not expired
  // 3. Update the user's password
  // 4. Invalidate the reset token

  res.json({
    success: true,
    message: 'Password reset successfully'
  });
}));

// Logout (client-side token removal)
router.post('/logout', asyncHandler(async (req: Request, res: Response) => {
  // In a real application with token blacklisting, you would:
  // 1. Add the token to a blacklist
  // 2. Set token expiration in Redis/cache

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

export default router;