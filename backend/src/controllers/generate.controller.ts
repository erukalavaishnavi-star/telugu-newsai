import { Request, Response } from 'express';
import { prisma } from '../index';
import { generateSocialPosts } from '../services/gemini.service';

export async function generatePosts(req: Request, res: Response) {
  const { articleText, category = 'general', tone = 'formal' } = req.body;
  const userId = (req as any).userId as string;

  try {
    // 1. Call Gemini AI
    const aiOutput = await generateSocialPosts({ articleText, category, tone });

    // 2. Extract title (first non-empty line)
    const title =
      aiOutput.headline?.slice(0, 500) ??
      articleText.split('\n').find((l: string) => l.trim())?.slice(0, 500) ??
      'Untitled';

    // 3. Save article to DB
    const article = await prisma.article.create({
      data: {
        userId,
        title,
        body: articleText,
        category,
        charCount: articleText.length,
        sentiment: aiOutput.sentiment as any,
      },
    });

    // 4. Save generated post
    const post = await prisma.generatedPost.create({
      data: {
        articleId: article.id,
        userId,
        headline:         aiOutput.headline,
        keyFacts:         aiOutput.keyFacts ?? [],
        captionVariations: aiOutput.captionVariations ?? [],
        summary:          aiOutput.summary,
        facebookPost:     aiOutput.facebookPost,
        instagramCaption: aiOutput.instagramCaption,
        twitterPost:      aiOutput.twitterPost,
        whatsappText:     aiOutput.whatsappText,
        youtubePost:      aiOutput.youtubeCommunity,
        breakingAlert:    aiOutput.breakingAlert,
        generationMs:     aiOutput.generationMs,
        aiModel:          'gemini-1.5-flash',
      },
    });

    // 5. Save hashtags
    if (aiOutput.hashtags?.length) {
      await prisma.hashtag.createMany({
        data: aiOutput.hashtags.map((tag) => ({ postId: post.id, tag })),
      });
    }

    // 6. Save SEO keywords
    if (aiOutput.seoKeywords?.length) {
      await prisma.seoKeyword.createMany({
        data: aiOutput.seoKeywords.map((keyword) => ({ postId: post.id, keyword })),
      });
    }

    // 7. Log history
    await prisma.generationHistory.create({
      data: { userId, postId: post.id, action: 'generate' },
    });

    // 8. Respond
    res.status(200).json({
      success: true,
      data: {
        id:               post.id,
        headline:         aiOutput.headline,
        keyFacts:         aiOutput.keyFacts ?? [],
        captionVariations: aiOutput.captionVariations ?? [],
        summary:          aiOutput.summary,
        facebookPost:     aiOutput.facebookPost,
        instagramCaption: aiOutput.instagramCaption,
        twitterPost:      aiOutput.twitterPost,
        whatsappText:     aiOutput.whatsappText,
        youtubeCommunity: aiOutput.youtubeCommunity,
        breakingAlert:    aiOutput.breakingAlert,
        hashtags:         aiOutput.hashtags,
        seoKeywords:      aiOutput.seoKeywords,
        sentiment:        aiOutput.sentiment,
        generationMs:     aiOutput.generationMs,
        generatedAt:      post.createdAt,
      },
    });
  } catch (err) {
    console.error('generatePosts error:', err);
    res.status(500).json({ success: false, message: 'AI generation failed. Please try again.' });
  }
}
