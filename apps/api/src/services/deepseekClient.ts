import OpenAI from 'openai';
import dotenv from 'dotenv';
import pino from 'pino';

dotenv.config();
const logger = pino();

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || '',
});

export async function detectClichesNuanced(text: string): Promise<{ phrase: string, reason: string }[]> {
  if (!process.env.DEEPSEEK_API_KEY) {
    logger.warn('DEEPSEEK_API_KEY not found, skipping nuanced detection');
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

    const response = await deepseek.chat.completions.create({
      model: "deepseek-v4-pro", // Latest DeepSeek language model
      messages: [
        { role: "system", content: "You are a writing editor specializing in detecting AI-generated phrases. Return ONLY a JSON array." },
        { role: "user", content: prompt }
      ],
      response_format: { type: 'json_object' } // Force JSON mode
    });

    const content = response.choices[0].message.content;
    if (content) {
      // The model might wrap JSON in markdown block like ```json ... ```
      const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanContent);
    }
    return [];
  } catch (error) {
    logger.error(error, 'DeepSeek API detection failed');
    return [];
  }
}
