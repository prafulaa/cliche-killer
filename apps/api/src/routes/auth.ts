import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import { sendMagicLink } from '../services/emailService.js';
import dotenv from 'dotenv';
import pino from 'pino';

dotenv.config();
const logger = pino();
const router = Router();

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

router.post('/request-magic-link', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  try {
    // Generate a temporary token for the magic link
    const token = jwt.sign({ email, type: 'magic-link' }, JWT_SECRET, { expiresIn: '15m' });
    
    await sendMagicLink(email, token);
    
    res.json({ message: 'Magic link sent! Check your inbox.' });
  } catch (error) {
    logger.error(error, 'Magic link request failed');
    res.status(500).json({ error: 'Failed to send magic link' });
  }
});

router.get('/verify', async (req, res) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string, type: string };
    
    if (decoded.type !== 'magic-link') {
      throw new Error('Invalid token type');
    }

    // Check if user exists, if not create
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', decoded.email)
      .single();

    let userId;
    if (fetchError && fetchError.code === 'PGRST116') {
      // User doesn't exist, create one
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{ email: decoded.email }])
        .select()
        .single();
      
      if (createError) throw createError;
      userId = newUser.id;
    } else {
      userId = user.id;
    }

    // Generate session JWT
    const sessionToken = jwt.sign({ userId, email: decoded.email }, JWT_SECRET, { expiresIn: '30d' });

    // Redirect to frontend with token (in a real app, use cookies or a secure way)
    res.redirect(`${process.env.APP_URL}/login/callback?token=${sessionToken}`);
  } catch (error) {
    logger.error(error, 'Token verification failed');
    res.redirect(`${process.env.APP_URL}/login?error=invalid_token`);
  }
});

export default router;
