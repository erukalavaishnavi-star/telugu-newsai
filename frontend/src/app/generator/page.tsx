'use client';

import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Navbar from '@/components/shared/Navbar';
import AuthGuard from '@/components/shared/AuthGuard';
import ArticleInput from '@/components/generator/ArticleInput';
import OutputCard from '@/components/generator/OutputCard';
import GenerateButton from '@/components/generator/GenerateButton';
import HashtagChips from '@/components/generator/HashtagChips';
import HeadlineCard from '@/components/generator/HeadlineCard';
import VariationsCard from '@/components/generator/VariationsCard';
import ExportBar from '@/components/generator/ExportBar';
import { PLATFORM_CONFIGS } from '@/lib/utils';
import { generateApi, getApiErrorMessage } from '@/lib/api';
import type { Category, GeneratedContent, Tone } from '@/types';

const SAMPLES = [
  {
    cat: 'sports' as Category,
    text: `IPL 2025: సన్‌రైజర్స్ హైదరాబాద్ ఫైనల్స్‌లోకి అర్హత సాధించింది!

ముంబై వద్ద జరిగిన క్వాలిఫైయర్-1 మ్యాచ్‌లో సన్‌రైజర్స్ హైదరాబాద్ ముంబై ఇండియన్స్‌పై 7 వికెట్ల తేడాతో ఘన విజయం సాధించింది. హైదరాబాద్ పేసర్లు ముంబైని కేవలం 142 రన్‌లకే కట్టడి చేశారు.

మ్యాచ్ హీరో ట్రావిస్ హెడ్ 58 బంతుల్లో 89 పరుగులు చేశాడు. వచ్చే వారం చెన్నైలో ఫైనల్ మ్యాచ్ జరగనుంది.`,
  },
  {
    cat: 'politics' as Category,
    text: `తెలంగాణ బడ్జెట్ 2025-26: రైతులకు ₹15,000 కోట్ల ప్యాకేజ్ ప్రకటన

హైదరాబాద్, మే 29: తెలంగాణ ముఖ్యమంత్రి రేవంత్ రెడ్డి నేడు అసెంబ్లీలో 2025-26 బడ్జెట్ ప్రవేశపెట్టారు. మొత్తం ₹2.8 లక్షల కోట్ల బడ్జెట్‌లో రైతులకు రూ.15,000 కోట్ల ప్రత్యేక ప్యాకేజ్ ప్రకటించారు.`,
  },
  {
    cat: 'technology' as Category,
    text: `హైదరాబాద్ AI స్టార్టప్ 'న్యూరోటెక్'కు ₹500 కోట్ల పెట్టుబడి

హైదరాబాద్, మే 29: హైదరాబాద్ కేంద్రంగా పనిచేసే ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ స్టార్టప్ 'న్యూరోటెక్ ఇండియా'కు అమెరికన్ వెంచర్ కంపెనీ ₹500 కోట్ల పెట్టుబడి ఇచ్చింది.`,
  },
  {
    cat: 'weather' as Category,
    text: `హైదరాబాద్‌లో రేపు భారీ వర్షాలు — ఆరెంజ్ అలర్ట్ జారీ

హైదరాబాద్, మే 29: హైదరాబాద్ మరియు రంగారెడ్డి జిల్లాల్లో రేపు భారీ వర్షాలు కురిసే అవకాశం ఉందని వాతావరణ శాఖ తెలిపింది.`,
  },
];

const PROGRESS_STEPS = [
  [15, 'వార్తను విశ్లేషిస్తోంది...'],
  [35, 'ముఖ్య వాస్తవాలు గుర్తిస్తోంది...'],
  [55, 'పోస్ట్‌లు రాస్తోంది...'],
  [75, 'హ్యాష్‌ట్యాగ్‌లు తయారవుతున్నాయి...'],
  [90, 'దాదాపు పూర్తయింది...'],
] as const;

function GeneratorContent() {
  const queryClient = useQueryClient();
  const [article, setArticle] = useState('');
  const [category, setCategory] = useState<Category>('general');
  const [tone, setTone] = useState<Tone>('formal');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [showSamples, setShowSamples] = useState(false);

  const loadSample = (idx: number) => {
    const s = SAMPLES[idx];
    setArticle(s.text);
    setCategory(s.cat);
    setShowSamples(false);
  };

  const generate = useCallback(async () => {
    if (article.trim().length < 50) {
      toast.error('Please paste a news article (minimum 50 characters)');
      return;
    }
    setLoading(true);
    setContent(null);
    setProgress(0);

    let step = 0;
    const interval = setInterval(() => {
      if (step < PROGRESS_STEPS.length) {
        setProgress(PROGRESS_STEPS[step][0]);
        setProgressLabel(PROGRESS_STEPS[step][1] as string);
        step++;
      }
    }, 1200);

    try {
      const result = await generateApi.generate({
        articleText: article,
        category,
        tone,
      });
      clearInterval(interval);
      setContent(result);
      setProgress(100);
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
      toast.success(`Generated in ${(result.generationMs / 1000).toFixed(1)}s`);
    } catch (err) {
      clearInterval(interval);
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 800);
    }
  }, [article, category, tone]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-head font-extrabold text-xl text-slate-900">AI Post Generator</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Paste your Telugu article → get posts for all platforms instantly
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-lg">
            ⚡ Gemini via secure API · Saved to your history
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 items-start">
          <div>
            <ArticleInput
              value={article}
              onChange={setArticle}
              category={category}
              onCategoryChange={setCategory}
              tone={tone}
              onToneChange={setTone}
              onLoadSample={() => setShowSamples(true)}
            />
            <GenerateButton
              onClick={generate}
              loading={loading}
              disabled={article.trim().length < 50}
              progress={progress}
              progressLabel={progressLabel}
            />
          </div>

          <div className="space-y-3">
            <ExportBar content={content} />
            <HeadlineCard
              headline={content?.headline}
              keyFacts={content?.keyFacts}
              loading={loading}
            />
            <VariationsCard variations={content?.captionVariations ?? []} loading={loading} />
            {PLATFORM_CONFIGS.map((cfg) => (
              <OutputCard key={cfg.key} config={cfg} content={content} loading={loading} />
            ))}
            <HashtagChips
              hashtags={content?.hashtags ?? []}
              seoKeywords={content?.seoKeywords ?? []}
              loading={loading}
            />
          </div>
        </div>
      </main>

      {showSamples && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSamples(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-head font-bold text-slate-900">Load Sample Article</h3>
              <button
                type="button"
                onClick={() => setShowSamples(false)}
                className="text-slate-400 hover:text-slate-700 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="space-y-2.5">
              {[
                { title: 'IPL 2025: సన్‌రైజర్స్ ఫైనల్స్‌లోకి', cat: '⚽ Sports' },
                { title: 'తెలంగాణ బడ్జెట్ 2025-26', cat: '🏛️ Politics' },
                { title: 'హైదరాబాద్ AI స్టార్టప్', cat: '💻 Technology' },
                { title: 'హైదరాబాద్‌లో భారీ వర్షాలు', cat: '🌧️ Weather' },
              ].map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => loadSample(i)}
                  className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50 transition-all"
                >
                  <p className="text-sm font-semibold text-slate-800 font-telugu">{s.title}</p>
                  <p className="text-xs text-red-600 mt-1 font-medium">{s.cat}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GeneratorPage() {
  return (
    <AuthGuard>
      <GeneratorContent />
    </AuthGuard>
  );
}
