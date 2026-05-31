import { Router } from 'express';
import { getDashboardStats } from '../controllers/stats.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.get('/', authMiddleware, getDashboardStats);
export default router;
