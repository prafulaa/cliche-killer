import Stripe from 'stripe';
import dotenv from 'dotenv';
import pino from 'pino';

dotenv.config();
const logger = pino();

// Lazy initialization to allow server to start without STRIPE_SECRET_KEY
let stripeClient: Stripe | null = null;

function getStripeClient(): Stripe {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-04-22.dahlia',
    });
  }
  return stripeClient;
}

export const createCheckoutSession = async (userId: string, email: string, priceId: string) => {
  try {
    const session = await getStripeClient().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.APP_URL}/analyze?success=true`,
      cancel_url: `${process.env.APP_URL}/pricing?canceled=true`,
      customer_email: email,
      metadata: { userId },
    });
    return session;
  } catch (error) {
    logger.error(error, 'Stripe checkout session creation failed');
    throw error;
  }
};

export const createPortalSession = async (customerId: string) => {
  try {
    const session = await getStripeClient().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.APP_URL}/settings`,
    });
    return session;
  } catch (error) {
    logger.error(error, 'Stripe portal session creation failed');
    throw error;
  }
};

// Export for webhook signature verification
export const constructWebhookEvent = (payload: Buffer, sig: string, secret: string) => {
  return getStripeClient().webhooks.constructEvent(payload, sig, secret);
};
