'use client';

import { useQuery } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import { historyApi } from '@/lib/api';
import OutputCard from '@/components/generator/OutputCard';
import HashtagChips from '@/components/generator/HashtagChips';
import HeadlineCard from '@/components/generator/HeadlineCard';
import VariationsCard from '@/components/generator/VariationsCard';
import ExportBar from '@/components/generator/ExportBar';
import { PLATFORM_CONFIGS } from '@/lib/utils';

interface HistoryDetailModalProps {
  postId: string | null;
  onClose: () => void;
}

export default function HistoryDetailModal({ postId, onClose }: HistoryDetailModalProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['history', postId],
    queryFn: () => historyApi.getById(postId!),
    enabled: !!postId,
  });

  if (!postId) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-3xl my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h3 className="font-head font-bold text-slate-900">Generated content</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {isLoading && (
            <div className="flex items-center justify-center py-16 text-slate-500 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading...
            </div>
          )}
          {error && (
            <p className="text-sm text-red-600 text-center py-8">Failed to load generation.</p>
          )}
          {data && (
            <>
              <ExportBar content={data} />
              <HeadlineCard headline={data.headline} keyFacts={data.keyFacts} />
              <VariationsCard variations={data.captionVariations ?? []} />
              {PLATFORM_CONFIGS.map((cfg) => (
                <OutputCard key={cfg.key} config={cfg} content={data} loading={false} />
              ))}
              <HashtagChips hashtags={data.hashtags} seoKeywords={data.seoKeywords} loading={false} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
