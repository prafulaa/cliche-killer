import express, { Router } from 'express';
import stripe from '../services/stripeService.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import pino from 'pino';

dotenv.config();
const logger = pino();
const router = Router();
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Stripe requires the raw body for signature verification
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!sig || !webhookSecret) throw new Error('Missing signature or webhook secret');
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    logger.error(`Webhook signature verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = session.metadata.userId;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        await supabase
          .from('users')
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_tier: 'pro' // Default to pro for checkout, refine if multiple plans
          })
          .eq('id', userId);
        
        logger.info(`User ${userId} upgraded to Pro`);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer;

        await supabase
          .from('users')
          .update({
            subscription_tier: 'free',
            stripe_subscription_id: null
          })
          .eq('stripe_customer_id', customerId);
        
        logger.info(`Subscription deleted for customer ${customerId}`);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        logger.warn(`Payment failed for customer ${invoice.customer}`);
        // Handle failed payment (e.g., notify user)
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    logger.error(error, 'Error processing webhook event');
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
