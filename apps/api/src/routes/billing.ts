import { Router } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js';
import { createCheckoutSession, createPortalSession } from '../services/stripeService.js';
import dotenv from 'dotenv';
import pino from 'pino';

dotenv.config();
const logger = pino();
const router = Router();
import { supabase } from '../db/client.js';

router.post('/checkout', authenticate, async (req: AuthenticatedRequest, res) => {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });

  const { plan } = req.body; // 'pro' or 'team'
  const priceId = plan === 'team' ? process.env.STRIPE_PRICE_ID_TEAM : process.env.STRIPE_PRICE_ID_PRO;

  if (!priceId) {
    return res.status(400).json({ error: 'Invalid plan selected' });
  }

  try {
    const session = await createCheckoutSession(req.user.userId, req.user.email, priceId);
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

router.post('/portal', authenticate, async (req: AuthenticatedRequest, res) => {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', req.user.userId)
      .single();

    if (error || !user?.stripe_customer_id) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    const session = await createPortalSession(user.stripe_customer_id);
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create portal session' });
  }
});

export default router;
