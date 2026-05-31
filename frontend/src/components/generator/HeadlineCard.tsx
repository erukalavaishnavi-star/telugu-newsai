'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface HeadlineCardProps {
  headline?: string;
  keyFacts?: string[];
  loading?: boolean;
}

export default function HeadlineCard({ headline, keyFacts, loading }: HeadlineCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!headline) return;
    await navigator.clipboard.writeText(headline);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card overflow-hidden border-blue-100">
      <div className="flex items-center justify-between px-4 py-2.5 bg-blue-50 border-b border-blue-100">
        <span className="text-xs font-semibold text-blue-800">Headline & key facts</span>
        {headline && !loading && (
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <div className="px-4 py-3">
        {loading ? (
          <span className="shimmer block rounded h-6 w-3/4 mb-3" />
        ) : headline ? (
          <p className="font-telugu text-base font-semibold text-slate-900 leading-relaxed mb-3">
            {headline}
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic mb-2">Extracted headline appears here...</p>
        )}
        {loading ? (
          <div className="space-y-2">
            <span className="shimmer block rounded h-4 w-full" />
            <span className="shimmer block rounded h-4 w-5/6" />
          </div>
        ) : keyFacts && keyFacts.length > 0 ? (
          <ul className="space-y-1.5">
            {keyFacts.map((fact, i) => (
              <li key={i} className="font-telugu text-sm text-slate-600 flex gap-2">
                <span className="text-red-500 font-bold">•</span>
                {fact}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
