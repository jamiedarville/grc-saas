import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import db from '../database/connection';

const router = Router();

router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  const stats = {
    totalRisks: 0,
    totalControls: 0,
    totalVendors: 0,
    totalAudits: 0
  };
  res.json({ success: true, data: stats });
}));

export default router;
