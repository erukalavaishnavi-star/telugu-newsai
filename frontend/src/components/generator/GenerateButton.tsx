'use client';

import { Zap, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenerateButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
  progress: number;
  progressLabel: string;
}

export default function GenerateButton({
  onClick,
  loading,
  disabled,
  progress,
  progressLabel,
}: GenerateButtonProps) {
  return (
    <div className="mt-3 space-y-2">
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-150',
          loading
            ? 'bg-slate-700 cursor-not-allowed'
            : 'bg-red-600 hover:bg-red-700 active:scale-[0.99] shadow-sm hover:shadow-md'
        )}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Zap className="w-4 h-4" />
        )}
        {loading ? 'AI Generating...' : 'Generate All Posts'}
      </button>

      {loading && (
        <div className="space-y-1.5 animate-fade-in">
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-center text-slate-500 font-telugu">{progressLabel}</p>
        </div>
      )}
    </div>
  );
}
