import { Anthropic } from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import pino from 'pino';

dotenv.config();
const logger = pino();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function detectClichesNuanced(text: string): Promise<{ phrase: string, reason: string }[]> {
  if (!process.env.ANTHROPIC_API_KEY) {
    logger.warn('ANTHROPIC_API_KEY not found, skipping nuanced detection');
    return [];
  }

  try {
    const prompt = `You are a writing editor specializing in detecting AI-generated phrases. 
Analyze this text and identify phrases that sound artificial, overused, or AI-like:

"${text}"

Return ONLY a JSON array: 
[
  { "phrase": "exact phrase from text", "reason": "why it's clichéd" }
]

Focus on: corporate jargon, meaningless buzzwords, overused metaphors, corporate speak.`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620", // Using a current model
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return JSON.parse(content.text);
    }
    return [];
  } catch (error) {
    logger.error(error, 'Claude API detection failed');
    return [];
  }
}
