import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,                  // 100 requests per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please wait and try again.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  keyGenerator: (req) => {
    // Rate limit by user ID if available, else IP
    return (req as any).userId ?? req.ip ?? 'unknown';
  },
});
