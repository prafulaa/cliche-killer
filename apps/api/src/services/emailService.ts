import { Resend } from 'resend';
import dotenv from 'dotenv';
import pino from 'pino';

dotenv.config();
const logger = pino();

// Lazy initialization to allow server to start without API key
let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export async function sendMagicLink(email: string, token: string) {
  const loginUrl = `${process.env.APP_URL}/api/auth/verify?token=${token}`;

  try {
    const { data, error } = await getResendClient().emails.send({
      from: 'Cliché Killer <onboarding@resend.dev>', // Use verified domain in production
      to: [email],
      subject: 'Your Magic Link for Cliché Killer',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #e11d48;">Cliché Killer</h1>
          <p>Click the button below to sign in to your account. This link will expire in 15 minutes.</p>
          <a href="${loginUrl}" style="display: inline-block; padding: 12px 24px; background-color: #e11d48; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Sign In</a>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      logger.error(error, 'Failed to send magic link');
      throw new Error('Failed to send email');
    }

    return data;
  } catch (error) {
    logger.error(error, 'Email service error');
    throw error;
  }
}
