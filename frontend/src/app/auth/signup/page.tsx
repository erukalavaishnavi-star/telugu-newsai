'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi, getApiErrorMessage } from '@/lib/api';
import { storeAuth } from '@/lib/auth';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || password.length < 6) {
      toast.error('Name, email, and password (6+ chars) required');
      return;
    }
    setLoading(true);
    try {
      const tokens = await authApi.signup({ email, password, name, orgName: orgName || undefined });
      storeAuth(tokens);
      toast.success('Account created!');
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
          <h1 className="font-head font-extrabold text-white text-2xl mb-1">Create account</h1>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-7 shadow-2xl">
          <form onSubmit={handleSignup} className="space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-red-400"
            />
            <input
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="News organization (optional)"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-red-400"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-red-400"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 chars)"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-red-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating...' : 'Sign Up'}
            </button>
          </form>
          <p className="text-xs text-white/50 text-center mt-4">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-red-300 hover:text-red-200 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
