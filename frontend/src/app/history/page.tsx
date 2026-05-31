'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Trash2, Eye, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/shared/Navbar';
import AuthGuard from '@/components/shared/AuthGuard';
import HistoryDetailModal from '@/components/history/HistoryDetailModal';
import { CATEGORY_LABELS, formatDate } from '@/lib/utils';
import { historyApi, getApiErrorMessage } from '@/lib/api';
import type { Category } from '@/types';

const SENTIMENT_STYLE: Record<string, string> = {
  positive: 'bg-green-50 text-green-700',
  neutral: 'bg-slate-100 text-slate-600',
  negative: 'bg-red-50 text-red-700',
};

const FILTER_CATS = [
  'all',
  'politics',
  'sports',
  'crime',
  'business',
  'technology',
  'entertainment',
  'weather',
];

function HistoryContent() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [detailId, setDetailId] = useState<string | null>(null);

  useEffect(() => {
    const open = searchParams.get('open');
    if (open) setDetailId(open);
  }, [searchParams]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['history', query, activeCat],
    queryFn: () =>
      historyApi.list({
        search: query || undefined,
        category: activeCat === 'all' ? undefined : activeCat,
        limit: 50,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => historyApi.delete(id),
    onSuccess: () => {
      toast.success('Deleted');
      queryClient.invalidateQueries({ queryKey: ['history'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const items = data?.items ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-6">
        <div className="mb-5">
          <h1 className="font-head font-extrabold text-xl text-slate-900">Generation History</h1>
          <p className="text-sm text-slate-500 mt-0.5">Browse and re-use previously generated content</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <div className="relative flex-1 min-w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => refetch()}
              placeholder="Search articles..."
              className="input-base pl-9"
            />
          </div>
          {FILTER_CATS.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCat(cat)}
              className={`text-xs px-3 py-2 rounded-lg border font-medium capitalize transition-all ${
                activeCat === cat
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
              }`}
            >
              {cat === 'all' ? 'All' : CATEGORY_LABELS[cat as Category]?.te ?? cat}
            </button>
          ))}
        </div>

        <div className="card overflow-hidden">
          <div className="grid grid-cols-[2fr_100px_70px_80px_100px_80px] px-5 py-3 bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            <div>Article Title</div>
            <div>Category</div>
            <div>Posts</div>
            <div>Sentiment</div>
            <div>Date</div>
            <div>Actions</div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-red-600" />
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">No results found</div>
          ) : (
            items.map((row) => {
              const cat = CATEGORY_LABELS[row.category] ?? CATEGORY_LABELS.general;
              return (
                <div
                  key={row.id}
                  className="grid grid-cols-[2fr_100px_70px_80px_100px_80px] px-5 py-3.5 border-b border-slate-50 hover:bg-slate-50 transition-colors items-center"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800 leading-snug font-telugu line-clamp-2">
                      {row.articleTitle}
                    </p>
                  </div>
                  <div>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: cat.bg, color: cat.color }}
                    >
                      {cat.en}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500">{row.postsGenerated}</div>
                  <div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${SENTIMENT_STYLE[row.sentiment] ?? SENTIMENT_STYLE.neutral}`}
                    >
                      {row.sentiment}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">{formatDate(row.createdAt)}</div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDetailId(row.id)}
                      className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                      title="View"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(row.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <p className="text-xs text-slate-400 mt-3 text-right">
          Showing {items.length} of {data?.total ?? 0} records
        </p>
      </main>

      <HistoryDetailModal postId={detailId} onClose={() => setDetailId(null)} />
    </div>
  );
}

export default function HistoryPage() {
  return (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          </div>
        }
      >
        <HistoryContent />
      </Suspense>
    </AuthGuard>
  );
}
