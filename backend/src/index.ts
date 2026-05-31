import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import routes from './routes';

dotenv.config();

const app = express();
export const prisma = new PrismaClient();

// ─── Middleware ────────────────────────────────────────────────────────────
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
const corsOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins,
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    service: 'telugu-newsai-api',
    status: 'ok',
    health: '/health',
    api: '/api/v1',
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'telugu-newsai-api', timestamp: new Date().toISOString() });
});

app.use('/api/v1', routes);

// ─── 404 handler ──────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global error handler ──────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 3001;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Telugu NewsAI API running on http://${HOST}:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV ?? 'development'}`);
});

export default app;
