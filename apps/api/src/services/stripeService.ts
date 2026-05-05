import Stripe from 'stripe';
import dotenv from 'dotenv';
import pino from 'pino';

dotenv.config();
const logger = pino();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2026-04-22.dahlia',
});

export const createCheckoutSession = async (userId: string, email: string, priceId: string) => {
    try {
          const session = await stripe.checkout.sessions.create({
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
          const session = await stripe.billingPortal.sessions.create({
                  customer: customerId,
                  return_url: `${process.env.APP_URL}/settings`,
          });
          return session;
    } catch (error) {
          logger.error(error, 'Stripe portal session creation failed');
          throw error;
    }
};

export default stripe;
