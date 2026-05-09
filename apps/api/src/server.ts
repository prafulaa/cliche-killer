import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import timeout from 'express-timeout';
import dotenv from 'dotenv';
import pino from 'pino';
import healthRouter from './routes/health.js';
import analyzeRouter from './routes/analyze.js';
import authRouter from './routes/auth.js';
import billingRouter from './routes/billing.js';
import webhooksRouter from './routes/webhooks.js';
import { rateLimit } from './middleware/rateLimit.js';
import { authenticate } from './middleware/auth.js';

dotenv.config();

const logger = pino();
const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
if (process.env.APP_URL && !allowedOrigins.includes(process.env.APP_URL)) {
  allowedOrigins.push(process.env.APP_URL);
}
if (allowedOrigins.length === 0) {
  allowedOrigins.push('http://localhost:3000');
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(helmet());

// Request timeout middleware - 30 second timeout for all requests
app.use(timeout({ timeout: 30000, disableTimeout: false }));

// Timeout error handler - must be before routes
app.use((err: any, req: any, res: any, next: any) => {
  if (err.timeout) {
    return res.status(503).json({ error: 'Request timeout' });
  }
  next(err);
});

// Webhooks must be before express.json() to handle raw body
app.use('/api/webhooks', webhooksRouter);

app.use(express.json());

app.use('/healthz', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/billing', billingRouter);
app.use('/api/analyze', authenticate, rateLimit, analyzeRouter);

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
  });
}

// Generic error handler (must be after all routes)
app.use((err: any, _req: any, res: any, _next: any) => {
  logger.error(err, 'Unhandled error');
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
