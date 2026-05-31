import { Router } from 'express';
import { body } from 'express-validator';
import { login, signup, refresh } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ],
  validate,
  login
);

router.post(
  '/signup',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty().trim(),
    body('orgName').optional().trim(),
  ],
  validate,
  signup
);

router.post(
  '/refresh',
  [body('refreshToken').notEmpty()],
  validate,
  refresh
);

export default router;
