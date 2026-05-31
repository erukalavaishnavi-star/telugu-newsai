import { Request, Response } from 'express';
import { prisma } from '../index';

export async function listHistory(req: Request, res: Response) {
  const userId   = (req as any).userId as string;
  const page     = parseInt(String(req.query.page  ?? '1'));
  const limit    = Math.min(parseInt(String(req.query.limit ?? '20')), 100);
  const search   = String(req.query.search ?? '');
  const category = String(req.query.category ?? '');
  const skip     = (page - 1) * limit;

  try {
    const where: any = {
      userId,
      ...(search   ? { article: { title: { contains: search, mode: 'insensitive' } } } : {}),
      ...(category ? { article: { category } } : {}),
    };

    const [posts, total] = await Promise.all([
      prisma.generatedPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          article:  { select: { title: true, category: true, sentiment: true } },
          hashtags: { select: { tag: true } },
        },
      }),
      prisma.generatedPost.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        items: posts.map((p) => ({
          id:             p.id,
          articleTitle:   p.article.title ?? '',
          category:       p.article.category,
          postsGenerated: 8,
          sentiment:      p.article.sentiment ?? 'neutral',
          createdAt:      p.createdAt,
        })),
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('listHistory error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch history' });
  }
}

export async function getById(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const { id } = req.params;

  try {
    const post = await prisma.generatedPost.findFirst({
      where: { id, userId },
      include: {
        article:    { select: { sentiment: true } },
        hashtags:   { select: { tag: true } },
        seoKeywords: { select: { keyword: true } },
      },
    });

    if (!post) return res.status(404).json({ success: false, message: 'Not found' });

    res.json({
      success: true,
      data: {
        id:               post.id,
        headline:         post.headline,
        keyFacts:         (post.keyFacts as string[] | null) ?? [],
        captionVariations: (post.captionVariations as string[] | null) ?? [],
        summary:          post.summary,
        facebookPost:     post.facebookPost,
        instagramCaption: post.instagramCaption,
        twitterPost:      post.twitterPost,
        whatsappText:     post.whatsappText,
        youtubeCommunity: post.youtubePost,
        breakingAlert:    post.breakingAlert,
        hashtags:         post.hashtags.map((h) => h.tag),
        seoKeywords:      post.seoKeywords.map((k) => k.keyword),
        sentiment:        post.article.sentiment ?? 'neutral',
        generationMs:     post.generationMs,
        generatedAt:      post.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch post' });
  }
}

export async function deleteHistory(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const { id } = req.params;

  try {
    const post = await prisma.generatedPost.findFirst({ where: { id, userId } });
    if (!post) return res.status(404).json({ success: false, message: 'Not found' });

    await prisma.generatedPost.delete({ where: { id } });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
}
