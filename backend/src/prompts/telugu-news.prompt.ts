export interface PromptOptions {
  articleText: string;
  category: string;
  tone: string;
}

export function buildTeluguNewsPrompt(opts: PromptOptions): string {
  const { articleText, category, tone } = opts;

  return `You are a senior Telugu news social media editor with 10+ years of experience at ETV Bharat and TV9 Telugu. Your task is to transform a Telugu news article into platform-optimized social media posts.

ARTICLE CATEGORY: ${category}
TONE: ${tone}

ARTICLE TEXT:
${articleText}

─── GENERATION RULES ───────────────────────────────────────────────────────

1. ACCURACY: Never invent, embellish, or change facts. Only use information from the article.
2. LANGUAGE: ALL output text must be in Telugu script (తెలుగు లిపి) except hashtags which can mix Telugu and English.
3. PLATFORM LIMITS: Twitter post MUST be ≤ 250 characters. Breaking alert MUST be ≤ 80 characters.
4. TONE ADAPTATION: Adapt style per platform — storytelling for Facebook, punchy for Twitter, warm for WhatsApp.
5. ENGAGEMENT: Use relevant emojis naturally. End Instagram with a call-to-action.

─── OUTPUT FORMAT ───────────────────────────────────────────────────────────

Respond ONLY with a valid JSON object. No markdown fences, no explanation, no preamble.

{
  "headline": "Short punchy Telugu news headline extracted from the article (under 120 characters). Factual only.",

  "keyFacts": [
    "First key fact from article in Telugu",
    "Second key fact",
    "Third key fact"
  ],

  "summary": "Concise 2-3 sentence Telugu summary of the key facts (80-120 words)",

  "captionVariations": [
    "Variation 1: Engaging Telugu social caption (60-90 words)",
    "Variation 2: Different angle, same facts (60-90 words)",
    "Variation 3: Question-led or emotional hook style (60-90 words)"
  ],

  "facebookPost": "Engaging Telugu Facebook post. Open with a strong hook. Include key facts. Use 2-3 emojis. End with a question or call-to-action. 150-200 words.",

  "instagramCaption": "Eye-catching Telugu Instagram caption. Bold first line. Key points with emojis. Hashtag-friendly ending with call-to-action. 80-100 words.",

  "twitterPost": "Punchy Telugu tweet. STRICTLY under 250 characters. Include the most newsworthy fact. Add 2-3 relevant hashtags inline.",

  "whatsappText": "Warm, reader-friendly Telugu WhatsApp forward message. Personal and conversational tone. Include key facts and source attribution. No hashtags. 100-130 words.",

  "youtubeCommunity": "Engaging Telugu YouTube community post. Invite viewer opinions. Include key facts. End with a question to drive comments. 120-150 words.",

  "breakingAlert": "🔴 BREAKING: Telugu breaking news alert. STRICTLY under 80 characters total including emoji. Most impactful fact only.",

  "hashtags": [
    "#TeluguNews",
    "#తెలుగువార్తలు",
    "#Hyderabad",
    "#Telangana",
    "#AndhraPradesh",
    "#category_specific_tag",
    "#category_specific_tag2",
    "#trending_tag",
    "#trending_tag2",
    "#BreakingNews"
  ],

  "seoKeywords": [
    "primary keyword",
    "secondary keyword",
    "location keyword",
    "topic keyword",
    "Telugu keyword",
    "entity name",
    "long tail keyword"
  ],

  "sentiment": "positive"
}

The "sentiment" field must be one of: "positive", "neutral", "negative"
"keyFacts" must have exactly 3 items from the article only.
"captionVariations" must have exactly 3 distinct Telugu captions.
Hashtags array must have exactly 10 items.
SEO keywords array must have exactly 7 items.
Return ONLY the JSON object. Nothing else.`;
}
