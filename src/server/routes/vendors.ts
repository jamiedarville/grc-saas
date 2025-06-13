import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import db from '../database/connection';

const router = Router();

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const vendors = await db('vendors').where({ organizationId: req.user?.organizationId });
  res.json({ success: true, data: vendors });
}));

router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const vendorData = { ...req.body, organizationId: req.user?.organizationId, createdAt: new Date() };
  const [vendorId] = await db('vendors').insert(vendorData);
  const vendor = await db('vendors').where({ id: vendorId }).first();
  res.status(201).json({ success: true, data: vendor });
}));

export default router;
