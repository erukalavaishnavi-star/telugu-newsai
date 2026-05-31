'use client';

import { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import type { GeneratedContent } from '@/types';
import { buildCopyAllText, downloadJson } from '@/lib/export';

interface ExportBarProps {
  content: GeneratedContent | null;
}

export default function ExportBar({ content }: ExportBarProps) {
  const [copied, setCopied] = useState(false);

  if (!content) return null;

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(buildCopyAllText(content));
    setCopied(true);
    toast.success('All posts copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadJson(content);
    toast.success('JSON downloaded');
  };

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
      <button
        type="button"
        onClick={handleCopyAll}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-all"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? 'Copied all' : 'Copy all posts'}
      </button>
      <button
        type="button"
        onClick={handleDownload}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all"
      >
        <Download className="w-3.5 h-3.5" />
        Export JSON
      </button>
    </div>
  );
}
