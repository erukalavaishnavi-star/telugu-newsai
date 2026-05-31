'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface HashtagChipsProps {
  hashtags: string[];
  seoKeywords: string[];
  loading: boolean;
}

function ShimmerChip() {
  return <span className="shimmer inline-block rounded-full" style={{ width: 72, height: 26 }} />;
}

export default function HashtagChips({ hashtags, seoKeywords, loading }: HashtagChipsProps) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedSeo, setCopiedSeo] = useState(false);

  const copyAll = async (items: string[], setCopied: (v: boolean) => void) => {
    await navigator.clipboard.writeText(items.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Hashtags */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-100 text-violet-700">
            # Hashtags
          </span>
          <button
            onClick={() => copyAll(hashtags, setCopiedHash)}
            disabled={!hashtags.length || loading}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 transition-all disabled:opacity-40"
          >
            {copiedHash ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
            {copiedHash ? 'Copied!' : 'Copy All'}
          </button>
        </div>
        <div className="px-4 py-3 flex flex-wrap gap-2 min-h-[52px]">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <ShimmerChip key={i} />)
          ) : hashtags.length > 0 ? (
            hashtags.map((tag) => (
              <span
                key={tag}
                onClick={() => navigator.clipboard.writeText(tag)}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 text-blue-600 border border-slate-200 cursor-pointer hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-150"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">Hashtags appear here...</span>
          )}
        </div>
      </div>

      {/* SEO Keywords */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
            🔍 SEO Keywords
          </span>
          <button
            onClick={() => copyAll(seoKeywords, setCopiedSeo)}
            disabled={!seoKeywords.length || loading}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 transition-all disabled:opacity-40"
          >
            {copiedSeo ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
            {copiedSeo ? 'Copied!' : 'Copy All'}
          </button>
        </div>
        <div className="px-4 py-3 flex flex-wrap gap-2 min-h-[44px]">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <ShimmerChip key={i} />)
          ) : seoKeywords.length > 0 ? (
            seoKeywords.map((kw) => (
              <span
                key={kw}
                className="text-xs font-medium px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200"
              >
                {kw}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">SEO keywords appear here...</span>
          )}
        </div>
      </div>
    </div>
  );
}
