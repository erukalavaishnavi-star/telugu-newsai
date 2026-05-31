'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { Category, Tone } from '@/types';

interface ArticleInputProps {
  value: string;
  onChange: (v: string) => void;
  category: Category;
  onCategoryChange: (c: Category) => void;
  tone: Tone;
  onToneChange: (t: Tone) => void;
  onLoadSample: () => void;
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'general',       label: 'General' },
  { value: 'politics',      label: 'రాజకీయాలు' },
  { value: 'sports',        label: 'క్రీడలు' },
  { value: 'crime',         label: 'నేరాలు' },
  { value: 'business',      label: 'వ్యాపారం' },
  { value: 'entertainment', label: 'వినోదం' },
  { value: 'technology',    label: 'సాంకేతికత' },
  { value: 'weather',       label: 'వాతావరణం' },
];

const MAX_CHARS = 5000;

export default function ArticleInput({
  value,
  onChange,
  category,
  onCategoryChange,
  tone,
  onToneChange,
  onLoadSample,
}: ArticleInputProps) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const pct = Math.min((value.length / MAX_CHARS) * 100, 100);
  const overLimit = value.length > MAX_CHARS;

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
        <h3 className="font-head font-bold text-sm text-slate-900">Telugu News Article</h3>
        <button
          onClick={onLoadSample}
          className="text-xs text-slate-500 hover:text-red-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:border-red-200 transition-colors"
        >
          📄 Load Sample
        </button>
      </div>

      {/* Textarea */}
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          'ఇక్కడ తెలుగు వార్తా వ్యాసాన్ని అతికించండి...\n\n' +
          'Paste your Telugu news article here. The AI will extract headlines, key facts, and sentiment — then generate platform-specific posts instantly.'
        }
        className={cn(
          'w-full min-h-[300px] resize-y p-5 font-telugu text-sm leading-8 text-slate-900 bg-white outline-none placeholder:font-sans placeholder:text-slate-400 placeholder:text-[13px] placeholder:leading-6',
          overLimit && 'border-b-2 border-red-400'
        )}
        maxLength={MAX_CHARS + 200}
      />

      {/* Progress bar */}
      <div className="h-0.5 bg-slate-100">
        <div
          className={cn('h-full transition-all duration-300', overLimit ? 'bg-red-500' : 'bg-blue-500')}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Footer controls */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-3">
        <span className={cn('text-xs', overLimit ? 'text-red-600 font-semibold' : 'text-slate-400')}>
          {value.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
        </span>

        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as Category)}
          className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 outline-none cursor-pointer"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <select
          value={tone}
          onChange={(e) => onToneChange(e.target.value as Tone)}
          className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 outline-none cursor-pointer"
        >
          <option value="formal">Formal Tone</option>
          <option value="casual">Casual Tone</option>
          <option value="breaking">Breaking News</option>
        </select>

        {value.length > 0 && (
          <button
            onClick={() => onChange('')}
            className="text-xs text-slate-400 hover:text-red-500 transition-colors ml-auto"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
