'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlatformConfig, GeneratedContent } from '@/types';

interface OutputCardProps {
  config: PlatformConfig;
  content: GeneratedContent | null;
  loading: boolean;
}

function ShimmerLine({ width = '100%' }: { width?: string }) {
  return (
    <span
      className="shimmer block rounded"
      style={{ width, height: 14, marginBottom: 6 }}
    />
  );
}

export default function OutputCard({ config, content, loading }: OutputCardProps) {
  const [copied, setCopied] = useState(false);

  const text = content ? String(content[config.key] ?? '') : '';
  const charCount = text.length;
  const overLimit = config.maxChars ? charCount > config.maxChars : false;

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card overflow-hidden hover:border-blue-200 transition-colors">
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
        <span
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: config.bgColor, color: config.color }}
        >
          <span className="text-sm leading-none">{config.icon}</span>
          {config.label}
        </span>

        <div className="flex items-center gap-2">
          {config.maxChars && text && (
            <span className={cn('text-[10px] font-medium', overLimit ? 'text-red-500' : 'text-slate-400')}>
              {charCount}/{config.maxChars}
            </span>
          )}
          <button
            onClick={handleCopy}
            disabled={!text || loading}
            className={cn(
              'flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-all duration-150',
              copied
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-white text-slate-500 border-slate-200 hover:text-slate-900 hover:border-slate-300',
              (!text || loading) && 'opacity-40 cursor-not-allowed'
            )}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Card body */}
      <div className="px-4 py-3 min-h-[70px]">
        {loading ? (
          <div>
            <ShimmerLine width="92%" />
            <ShimmerLine width="78%" />
            <ShimmerLine width="60%" />
          </div>
        ) : text ? (
          <p className="font-telugu text-sm leading-8 text-slate-800 animate-fade-in whitespace-pre-wrap">
            {text}
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic leading-6">{config.label} post appears here after generation...</p>
        )}
      </div>
    </div>
  );
}
