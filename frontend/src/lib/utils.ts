import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Category, PlatformConfig } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '…' : text;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export const CATEGORY_LABELS: Record<Category, { en: string; te: string; color: string; bg: string }> = {
  general:       { en: 'General',       te: 'సాధారణ',     color: '#64748b', bg: '#f1f5f9' },
  politics:      { en: 'Politics',      te: 'రాజకీయాలు',  color: '#1e40af', bg: '#dbeafe' },
  sports:        { en: 'Sports',        te: 'క్రీడలు',    color: '#166534', bg: '#dcfce7' },
  crime:         { en: 'Crime',         te: 'నేరాలు',     color: '#991b1b', bg: '#fee2e2' },
  business:      { en: 'Business',      te: 'వ్యాపారం',   color: '#92400e', bg: '#fef3c7' },
  entertainment: { en: 'Entertainment', te: 'వినోదం',     color: '#6b21a8', bg: '#f3e8ff' },
  technology:    { en: 'Technology',    te: 'సాంకేతికత',  color: '#5b21b6', bg: '#ede9fe' },
  weather:       { en: 'Weather',       te: 'వాతావరణం',   color: '#0369a1', bg: '#e0f2fe' },
};

export const PLATFORM_CONFIGS: PlatformConfig[] = [
  {
    key: 'summary',
    label: 'Summary',
    icon: '📰',
    color: '#475569',
    bgColor: '#f8fafc',
  },
  {
    key: 'facebookPost',
    label: 'Facebook',
    icon: 'f',
    color: '#1e40af',
    bgColor: '#dbeafe',
  },
  {
    key: 'instagramCaption',
    label: 'Instagram',
    icon: '◈',
    color: '#9d174d',
    bgColor: '#fce7f3',
  },
  {
    key: 'twitterPost',
    label: 'Twitter / X',
    icon: '𝕏',
    color: '#0369a1',
    bgColor: '#e0f2fe',
    maxChars: 280,
  },
  {
    key: 'whatsappText',
    label: 'WhatsApp',
    icon: '💬',
    color: '#166534',
    bgColor: '#dcfce7',
  },
  {
    key: 'youtubeCommunity',
    label: 'YouTube Community',
    icon: '▶',
    color: '#991b1b',
    bgColor: '#fee2e2',
  },
  {
    key: 'breakingAlert',
    label: 'Breaking Alert',
    icon: '🔴',
    color: '#991b1b',
    bgColor: '#fee2e2',
    maxChars: 100,
  },
];
