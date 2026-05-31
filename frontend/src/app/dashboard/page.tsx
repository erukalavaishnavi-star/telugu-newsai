'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import AuthGuard from '@/components/shared/AuthGuard';
import StatsGrid from '@/components/dashboard/StatsGrid';
import { CATEGORY_LABELS, formatDate } from '@/lib/utils';
import { statsApi } from '@/lib/api';
import type { Category } from '@/types';

function DashboardContent() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => statsApi.getDashboard(),
  });

  const categories = stats?.categories ?? [];
  const recent = stats?.recent ?? [];
  const maxCount = Math.max(...categories.map((c) => c.count), 1);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-blue-900 p-7 flex items-center justify-between">
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-red-600/20" />
          <div className="absolute right-16 -bottom-14 w-36 h-36 rounded-full bg-blue-500/20" />

          <div className="relative z-10">
            <span className="inline-block bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              🔴 Live AI Platform
            </span>
            <h1 className="font-head font-extrabold text-white text-2xl leading-tight mb-2">
              Telugu News Social Media
              <br />
              Post Generator
            </h1>
            <p className="text-sm text-white/60 max-w-md leading-relaxed">
              AI-powered content automation for Telugu news publishers.
            </p>
          </div>

          <Link
            href="/generator"
            className="relative z-10 flex-shrink-0 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Generate Posts →
          </Link>
        </div>

        {isLoading || !stats ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          </div>
        ) : (
          <StatsGrid stats={stats} />
        )}

        <div className="grid grid-cols-5 gap-5">
          <div className="col-span-3 card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
              <h2 className="font-head font-bold text-sm text-slate-900">Recent Generations</h2>
              <Link href="/history" className="text-xs text-blue-600 hover:underline">
                View all
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {recent.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-10">
                  No generations yet.{' '}
                  <Link href="/generator" className="text-red-600 hover:underline">
                    Create your first
                  </Link>
                </p>
              ) : (
                recent.map((item) => {
                  const cat =
                    CATEGORY_LABELS[item.category as Category] ?? CATEGORY_LABELS.general;
                  return (
                    <Link
                      href={`/history?open=${item.id}`}
                      key={item.id}
                      className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 leading-snug font-telugu truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {formatDate(item.createdAt)} · {item.posts} posts
                        </p>
                      </div>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.bg, color: cat.color }}
                      >
                        {cat.en}
                      </span>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          <div className="col-span-2 card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
              <h2 className="font-head font-bold text-sm text-slate-900">Top Categories</h2>
              <span className="text-[11px] text-slate-400">This month</span>
            </div>
            <div className="px-5 py-3 divide-y divide-slate-50">
              {categories.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No category data yet</p>
              ) : (
                categories.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-3 py-2.5">
                    <span className="text-sm font-telugu text-slate-700 w-24 flex-shrink-0">
                      {cat.teluguName}
                    </span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(cat.count / maxCount) * 100}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 w-8 text-right">{cat.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
