import { Router, Request, Response } from 'express';
import { asyncHandler, createError } from '../middleware/errorHandler';
import db from '../database/connection';

const router = Router();

// Get compliance frameworks
router.get('/frameworks', asyncHandler(async (req: Request, res: Response) => {
  const frameworks = await db('compliance_frameworks')
    .where({ organizationId: req.user?.organizationId, isActive: true })
    .orderBy('name');

  res.json({
    success: true,
    data: frameworks
  });
}));

// Get controls
router.get('/controls', asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, status, category } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let query = db('controls')
    .where({ organizationId: req.user?.organizationId });

  if (status) {
    query = query.where({ status });
  }

  if (category) {
    query = query.where({ category });
  }

  const controls = await query
    .orderBy('createdAt', 'desc')
    .limit(Number(limit))
    .offset(offset);

  const total = await db('controls')
    .where({ organizationId: req.user?.organizationId })
    .count('id as count')
    .first();

  res.json({
    success: true,
    data: controls,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: Number(total?.count || 0),
      totalPages: Math.ceil(Number(total?.count || 0) / Number(limit))
    }
  });
}));

// Create control
router.post('/controls', asyncHandler(async (req: Request, res: Response) => {
  const controlData = {
    ...req.body,
    organizationId: req.user?.organizationId,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const [controlId] = await db('controls').insert(controlData);
  const control = await db('controls').where({ id: controlId }).first();

  res.status(201).json({
    success: true,
    data: control,
    message: 'Control created successfully'
  });
}));

export default router;