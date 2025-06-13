import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import db from '../database/connection';

const router = Router();

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const integrations = await db('integrations').where({ organizationId: req.user?.organizationId });
  res.json({ success: true, data: integrations });
}));

export default router;
