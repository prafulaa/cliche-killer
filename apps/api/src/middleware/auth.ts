import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { supabase } from '../db/client.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_only_secret_do_not_use_in_production';

if (!process.env.JWT_SECRET) {
  console.warn('WARNING: Using fallback JWT secret for development. Set JWT_SECRET env var in production.');
}

if (!process.env.JWT_SECRET) {
  console.warn('WARNING: Using fallback JWT secret for development. Set JWT_SECRET env var in production.');
}

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const apiKeyHeader = req.headers['x-api-key'];

  // 1. Check for JWT (Browser Users)
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, email: string };
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }

  // 2. Check for API Key (Extension / API Users)
  if (apiKeyHeader && typeof apiKeyHeader === 'string') {
    try {
      const { data: keyData, error } = await supabase
        .from('api_keys')
        .select('user_id, users(email)')
        .eq('key', apiKeyHeader)
        .single();

      if (error || !keyData) {
        return res.status(401).json({ error: 'Invalid API Key' });
      }

      req.user = {
        userId: keyData.user_id,
        email: (keyData.users as any).email
      };

      // Update last used at
      await supabase
        .from('api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('key', apiKeyHeader);

      return next();
    } catch (error) {
      return res.status(500).json({ error: 'Authentication service error' });
    }
  }

  // 3. Fallback to guest
  next();
};
