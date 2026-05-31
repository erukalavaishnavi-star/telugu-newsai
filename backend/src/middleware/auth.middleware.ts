import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'change-me-in-production';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Missing or invalid Authorization header' });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    (req as any).userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}
