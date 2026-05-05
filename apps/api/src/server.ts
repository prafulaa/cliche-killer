import express from 'express';
import cors from 'cors';
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

app.use(cors());

// Webhooks must be before express.json() to handle raw body
app.use('/api/webhooks', webhooksRouter);

app.use(express.json());

app.use('/healthz', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/billing', billingRouter);
app.use('/api/analyze', authenticate, rateLimit, analyzeRouter);

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
