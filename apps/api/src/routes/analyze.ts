import { Response } from 'express';
import { detectClichesFast, calculateHealthScore } from '../services/clicheDetector.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { createClient } from '@supabase/supabase-js';
import pino from 'pino';
import dotenv from 'dotenv';

dotenv.config();
const logger = pino();
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { text } = req.body;
    const user = req.user;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Quota Enforcement
    if (user) {
      // Authenticated user
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('analyses_used, subscription_tier')
        .eq('id', user.userId)
        .single();

      if (fetchError) throw fetchError;

      const limit = userData.subscription_tier === 'pro' ? Infinity : 50;
      if (userData.analyses_used >= limit) {
        return res.status(403).json({ error: 'Monthly quota reached. Please upgrade to Pro.' });
      }

      // Increment usage
      await supabase
        .from('users')
        .update({ analyses_used: userData.analyses_used + 1 })
        .eq('id', user.userId);
    } else {
      // Guest user (Quota handled by IP rate limit mostly, but let's be explicit if needed)
      // For now, guest is just 5 scans total per session/IP (tracked by middleware)
    }

    const words = text.split(/\s+/);
    let processedText = text;
    if (words.length > 10000) {
      processedText = words.slice(0, 10000).join(' ');
    }

    const cliches = detectClichesFast(processedText);
    const healthScore = calculateHealthScore(processedText, cliches);

    const analysis = {
      inputText: text,
      clichesFound: cliches.reduce((sum, c) => sum + (c.count || 0), 0),
      healthScore,
      clicheList: cliches,
      status: 'analyzed',
      createdAt: new Date().toISOString()
    };

    res.json(analysis);
  } catch (error) {
    logger.error(error, 'Analysis failed');
    res.status(500).json({ error: 'Internal server error' });
  }
};
