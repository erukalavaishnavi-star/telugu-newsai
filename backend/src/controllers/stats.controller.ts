import { Request, Response } from 'express';
import { prisma } from '../index';

const CATEGORY_META: Record<string, { teluguName: string; color: string }> = {
  politics:      { teluguName: 'రాజకీయాలు',  color: '#3b82f6' },
  sports:        { teluguName: 'క్రీడలు',    color: '#22c55e' },
  business:      { teluguName: 'వ్యాపారం',  color: '#f59e0b' },
  technology:    { teluguName: 'సాంకేతికత', color: '#8b5cf6' },
  crime:         { teluguName: 'నేరాలు',    color: '#ef4444' },
  entertainment: { teluguName: 'వినోదం',    color: '#06b6d4' },
  weather:       { teluguName: 'వాతావరణం',  color: '#0369a1' },
  general:       { teluguName: 'సాధారణ',    color: '#64748b' },
};

export async function getDashboardStats(req: Request, res: Response) {
  const userId = (req as any).userId as string;

  try {
    const now       = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart  = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
    const prevWeekStart = new Date(now.getTime() - 14 * 24 * 3600 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalArticles,
      todayGenerations,
      weekCount,
      prevWeekCount,
      avgMs,
      topCategoryResult,
      categoryGroups,
      recentPosts,
    ] = await Promise.all([
      prisma.article.count({ where: { userId } }),
      prisma.generatedPost.count({ where: { userId, createdAt: { gte: todayStart } } }),
      prisma.generatedPost.count({ where: { userId, createdAt: { gte: weekStart } } }),
      prisma.generatedPost.count({ where: { userId, createdAt: { gte: prevWeekStart, lt: weekStart } } }),
      prisma.generatedPost.aggregate({ where: { userId }, _avg: { generationMs: true } }),
      prisma.article.groupBy({
        by: ['category'],
        where: { userId },
        _count: { _all: true },
        orderBy: { _count: { category: 'desc' } },
        take: 1,
      }),
      prisma.article.groupBy({
        by: ['category'],
        where: { userId, createdAt: { gte: monthStart } },
        _count: { _all: true },
        orderBy: { _count: { category: 'desc' } },
        take: 8,
      }),
      prisma.generatedPost.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { article: { select: { title: true, category: true } } },
      }),
    ]);

    const weeklyChange = prevWeekCount > 0
      ? Math.round(((weekCount - prevWeekCount) / prevWeekCount) * 100)
      : 100;

    const avgMs_val = avgMs._avg.generationMs ?? 4200;
    const timeSavedHours = Math.round((totalArticles * 35) / 60);

    const categories = categoryGroups.map((g) => {
      const meta = CATEGORY_META[g.category] ?? CATEGORY_META.general;
      return {
        name: g.category,
        teluguName: meta.teluguName,
        count: g._count._all,
        color: meta.color,
      };
    });

    const recent = recentPosts.map((p) => ({
      id: p.id,
      title: p.article.title ?? 'Untitled',
      category: p.article.category,
      posts: 10,
      createdAt: p.createdAt,
    }));

    res.json({
      success: true,
      data: {
        totalArticles,
        todayGenerations,
        timeSavedHours,
        avgGenerationTime: parseFloat((avgMs_val / 1000).toFixed(1)),
        topCategory: topCategoryResult[0]?.category ?? 'general',
        weeklyChange,
        categories,
        recent,
      },
    });
  } catch (err) {
    console.error('stats error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
}
