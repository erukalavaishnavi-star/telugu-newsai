import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildTeluguNewsPrompt } from '../prompts/telugu-news.prompt';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

export interface GenerationInput {
  articleText: string;
  category: string;
  tone: string;
}

export interface GenerationOutput {
  headline: string;
  keyFacts: string[];
  captionVariations: string[];
  summary: string;
  facebookPost: string;
  instagramCaption: string;
  twitterPost: string;
  whatsappText: string;
  youtubeCommunity: string;
  breakingAlert: string;
  hashtags: string[];
  seoKeywords: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  generationMs: number;
}

export async function generateSocialPosts(input: GenerationInput): Promise<GenerationOutput> {
  const start = Date.now();

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096,
      responseMimeType: 'application/json',
    },
  });

  const prompt = buildTeluguNewsPrompt(input);

  let lastError: Error | null = null;

  // Retry up to 3 times
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const raw = result.response.text();

      // Strip any accidental markdown fences
      const clean = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean) as GenerationOutput;

      // Enforce Twitter character limit
      if (parsed.twitterPost && parsed.twitterPost.length > 280) {
        parsed.twitterPost = parsed.twitterPost.slice(0, 277) + '...';
      }

      // Enforce breaking alert limit
      if (parsed.breakingAlert && parsed.breakingAlert.length > 100) {
        parsed.breakingAlert = parsed.breakingAlert.slice(0, 97) + '...';
      }

      return { ...parsed, generationMs: Date.now() - start };
    } catch (err) {
      lastError = err as Error;
      console.error(`Gemini attempt ${attempt} failed:`, err);
      if (attempt < 3) await sleep(1000 * attempt);
    }
  }

  throw new Error(`AI generation failed after 3 attempts: ${lastError?.message}`);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
