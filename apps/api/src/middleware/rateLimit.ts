import { Request, Response, NextFunction } from 'express';
import pino from 'pino';

const logger = pino();

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const ipCache = new Map<string, RateLimitInfo>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 30;

export const rateLimit = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  
  let info = ipCache.get(ip);

  if (!info || now > info.resetTime) {
    info = {
      count: 1,
      resetTime: now + WINDOW_MS
    };
    ipCache.set(ip, info);
    return next();
  }

  if (info.count >= MAX_REQUESTS) {
    logger.warn(`Rate limit exceeded for IP: ${ip}`);
    return res.status(429).json({
      error: 'Too many requests. Please try again in an hour.',
      retryAfter: Math.ceil((info.resetTime - now) / 1000)
    });
  }

  info.count++;
  next();
};
