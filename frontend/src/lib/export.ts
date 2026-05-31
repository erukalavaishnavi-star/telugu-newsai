import type { GeneratedContent } from '@/types';

export function buildExportPayload(content: GeneratedContent) {
  return {
    headline: content.headline,
    keyFacts: content.keyFacts,
    captionVariations: content.captionVariations,
    summary: content.summary,
    facebookPost: content.facebookPost,
    instagramCaption: content.instagramCaption,
    twitterPost: content.twitterPost,
    whatsappText: content.whatsappText,
    youtubeCommunity: content.youtubeCommunity,
    breakingAlert: content.breakingAlert,
    hashtags: content.hashtags,
    seoKeywords: content.seoKeywords,
    sentiment: content.sentiment,
    generatedAt: content.generatedAt,
  };
}

export function downloadJson(content: GeneratedContent, filename = 'telugu-newsai-posts.json') {
  const blob = new Blob([JSON.stringify(buildExportPayload(content), null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function buildCopyAllText(content: GeneratedContent): string {
  const lines = [
    content.headline ? `📰 ${content.headline}` : '',
    '',
    '── Summary ──',
    content.summary,
    '',
    '── Facebook ──',
    content.facebookPost,
    '',
    '── Instagram ──',
    content.instagramCaption,
    '',
    '── Twitter/X ──',
    content.twitterPost,
    '',
    '── WhatsApp ──',
    content.whatsappText,
    '',
    '── YouTube ──',
    content.youtubeCommunity,
    '',
    '── Breaking ──',
    content.breakingAlert,
    '',
    `Hashtags: ${content.hashtags?.join(' ') ?? ''}`,
    `SEO: ${content.seoKeywords?.join(', ') ?? ''}`,
  ];
  return lines.filter(Boolean).join('\n');
}
