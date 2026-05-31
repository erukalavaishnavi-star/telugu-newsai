'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { clearAuth } from '@/lib/auth';
import { Zap, LayoutDashboard, FileText, Clock, BookOpen, LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/generator',  label: 'Generator',   icon: Zap,  badge: 'AI' },
  { href: '/history',    label: 'History',     icon: Clock },
  { href: '/docs',       label: 'Docs',        icon: BookOpen },
];

export default function Navbar() {
  const pathname = usePathname();

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/auth/login';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 h-14 flex items-center justify-between px-6">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-head font-bold text-sm text-slate-900 leading-tight">Telugu NewsAI</p>
          <p className="text-[10px] text-slate-500 leading-tight">Social Media Generator</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon, badge }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
              pathname.startsWith(href)
                ? 'bg-slate-900 text-white'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
            {badge && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* User actions */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </nav>
  );
}
