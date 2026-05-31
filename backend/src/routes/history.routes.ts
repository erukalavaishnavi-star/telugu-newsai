import { Router } from 'express';
import { listHistory, getById, deleteHistory } from '../controllers/history.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/',     listHistory);
router.get('/:id',  getById);
router.delete('/:id', deleteHistory);

export default router;
