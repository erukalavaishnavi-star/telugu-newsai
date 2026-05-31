import { Router } from 'express';
import authRoutes from './auth.routes';
import generateRoutes from './generate.routes';
import historyRoutes from './history.routes';
import statsRoutes from './stats.routes';

const router = Router();

router.use('/auth',    authRoutes);
router.use('/generate', generateRoutes);
router.use('/history',  historyRoutes);
router.use('/stats',    statsRoutes);

export default router;
