import { Router } from 'express';
import { body } from 'express-validator';
import { generatePosts } from '../controllers/generate.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { rateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.post(
  '/',
  authMiddleware,
  rateLimiter,
  [
    body('articleText').notEmpty().isLength({ min: 50, max: 5000 }),
    body('category').optional().isIn([
      'general', 'politics', 'sports', 'crime',
      'business', 'entertainment', 'technology', 'weather',
    ]),
    body('tone').optional().isIn(['formal', 'casual', 'breaking']),
  ],
  validate,
  generatePosts
);

export default router;
