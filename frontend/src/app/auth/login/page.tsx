'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, FileText, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi, getApiErrorMessage } from '@/lib/api';
import { storeAuth } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('editor@demo.com');
  const [password, setPassword] = useState('demo1234');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const tokens = await authApi.login(email, password);
      storeAuth(tokens);
      toast.success(`Welcome, ${tokens.user.name ?? 'Editor'}!`);
      router.push('/dashboard');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-head font-extrabold text-white text-2xl mb-1">Telugu NewsAI</h1>
          <p className="text-sm text-white/50">Social Media Post Generator</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-7 shadow-2xl">
          <h2 className="font-head font-bold text-white text-lg mb-5">Sign in to your account</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-red-400 focus:bg-white/15 transition-all"
                placeholder="you@newsorg.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3.5 py-2.5 pr-10 text-sm text-white placeholder:text-white/30 outline-none focus:border-red-400 focus:bg-white/15 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-xs text-white/50 text-center mt-4">
            No account?{' '}
            <Link href="/auth/signup" className="text-red-300 hover:text-red-200 font-medium">
              Sign up
            </Link>
          </p>

          <div className="mt-5 pt-5 border-t border-white/10">
            <p className="text-xs text-white/40 text-center">
              Demo: <span className="text-white/70 font-mono">editor@demo.com</span> /{' '}
              <span className="text-white/70 font-mono">demo1234</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
