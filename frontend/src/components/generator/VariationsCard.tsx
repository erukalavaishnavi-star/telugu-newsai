'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface VariationsCardProps {
  variations: string[];
  loading?: boolean;
}

export default function VariationsCard({ variations, loading }: VariationsCardProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-700">Caption variations (3)</span>
      </div>
      <div className="p-4 space-y-3">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <span key={i} className="shimmer block rounded h-14 w-full" />
            ))}
          </div>
        ) : variations.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Variations appear after generation...</p>
        ) : (
          variations.map((v, i) => (
            <div key={i} className="flex gap-2 items-start group">
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded mt-1">
                {i + 1}
              </span>
              <p className="font-telugu text-sm leading-7 text-slate-800 flex-1">{v}</p>
              <button
                type="button"
                onClick={() => handleCopy(v, i)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all"
                title="Copy variation"
              >
                {copiedIdx === i ? (
                  <Check className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
