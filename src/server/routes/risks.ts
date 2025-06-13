import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import db from '../database/connection';

const router = Router();

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const risks = await db('risks').where({ organizationId: req.user?.organizationId });
  res.json({ success: true, data: risks });
}));

router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const riskData = { ...req.body, organizationId: req.user?.organizationId, createdAt: new Date() };
  const [riskId] = await db('risks').insert(riskData);
  const risk = await db('risks').where({ id: riskId }).first();
  res.status(201).json({ success: true, data: risk });
}));

export default router;
