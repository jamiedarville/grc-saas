import { Router, Request, Response } from 'express';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { requireRole } from '../middleware/auth';
import { UserRole } from '../../shared/types';
import db from '../database/connection';

const router = Router();

// Get current user profile
router.get('/profile', asyncHandler(async (req: Request, res: Response) => {
  const user = await db('users')
    .select('id', 'email', 'firstName', 'lastName', 'role', 'organizationId', 'isActive', 'lastLogin', 'createdAt')
    .where({ id: req.user?.id })
    .first();

  if (!user) {
    throw createError('User not found', 404);
  }

  res.json({
    success: true,
    data: user
  });
}));

// Update user profile
router.put('/profile', asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName } = req.body;
  const userId = req.user?.id;

  await db('users')
    .where({ id: userId })
    .update({
      firstName,
      lastName,
      updatedAt: new Date()
    });

  const updatedUser = await db('users')
    .select('id', 'email', 'firstName', 'lastName', 'role', 'organizationId', 'isActive')
    .where({ id: userId })
    .first();

  res.json({
    success: true,
    data: updatedUser,
    message: 'Profile updated successfully'
  });
}));

// Get all users (admin only)
router.get('/', requireRole([UserRole.ADMIN]), asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let query = db('users')
    .select('id', 'email', 'firstName', 'lastName', 'role', 'organizationId', 'isActive', 'lastLogin', 'createdAt')
    .where({ organizationId: req.user?.organizationId });

  if (search) {
    query = query.where(function() {
      this.where('firstName', 'like', `%${search}%`)
        .orWhere('lastName', 'like', `%${search}%`)
        .orWhere('email', 'like', `%${search}%`);
    });
  }

  const users = await query
    .orderBy('createdAt', 'desc')
    .limit(Number(limit))
    .offset(offset);

  const total = await db('users')
    .where({ organizationId: req.user?.organizationId })
    .count('id as count')
    .first();

  res.json({
    success: true,
    data: users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: Number(total?.count || 0),
      totalPages: Math.ceil(Number(total?.count || 0) / Number(limit))
    }
  });
}));

export default router;