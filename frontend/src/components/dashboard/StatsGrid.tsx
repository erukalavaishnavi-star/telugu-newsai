'use client';

import type { DashboardStats } from '@/types';

interface StatsGridProps {
  stats: DashboardStats;
}

const STAT_CARDS = [
  {
    key: 'totalArticles' as const,
    label: 'Articles Processed',
    sub: (s: DashboardStats) => `↑ ${s.weeklyChange}% this week`,
    accent: 'border-l-red-500',
    valueColor: 'text-slate-900',
  },
  {
    key: 'todayGenerations' as const,
    label: 'Posts Generated Today',
    sub: () => 'Across 6 platforms',
    accent: 'border-l-blue-500',
    valueColor: 'text-slate-900',
  },
  {
    key: 'timeSavedHours' as const,
    label: 'Hours Saved',
    sub: () => 'This month',
    accent: 'border-l-green-500',
    valueColor: 'text-green-700',
    suffix: 'h',
  },
  {
    key: 'avgGenerationTime' as const,
    label: 'Avg Generation Time',
    sub: () => 'Per article',
    accent: 'border-l-amber-500',
    valueColor: 'text-slate-900',
    suffix: 's',
  },
];

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {STAT_CARDS.map((card) => (
        <div
          key={card.key}
          className={`card p-5 border-l-4 ${card.accent}`}
        >
          <p className="text-[11px] text-slate-500 uppercase tracking-wide font-medium mb-2">
            {card.label}
          </p>
          <p className={`font-head font-extrabold text-3xl leading-none mb-1.5 ${card.valueColor}`}>
            {stats[card.key].toLocaleString()}
            {card.suffix && <span className="text-xl">{card.suffix}</span>}
          </p>
          <p className="text-[11px] text-slate-400">{card.sub(stats)}</p>
        </div>
      ))}
    </div>
  );
}
