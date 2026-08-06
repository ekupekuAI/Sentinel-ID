'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { signIn } from '@/services/authService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn({ email, password });
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <div className="sentinel-enter w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">SentinelID</h1>
          <p className="text-sm text-slate-400">Enterprise Identity Trust Platform</p>
        </div>

        {/* Login Card */}
        <div className="sentinel-surface rounded-2xl border border-slate-500/20 bg-slate-900/50 p-8 backdrop-blur-sm">
          <h2 className="mb-6 text-xl font-semibold text-white">SOC Portal Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground">
                Analyst Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@securelbank.com"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-foreground placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                required
                minLength={8}
                autoComplete="current-password"
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-foreground placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked
                  readOnly
                  className="rounded border-slate-600 bg-slate-800"
                />
                <span className="text-slate-400">Remember device</span>
              </label>
              <span className="cursor-not-allowed text-slate-500" title="Password reset is not configured for this MVP">
                Password reset unavailable
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {error && <p role="alert" className="mt-4 text-sm text-red-400">{error}</p>}

          {/* Demo Notice */}
          <div className="mt-6 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
            <p className="text-xs text-blue-400">
              <strong>Secure access:</strong> Sign in with your SentinelID account.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Copyright 2025 SentinelID. Enterprise security by design.
        </p>
      </div>
    </div>
  );
}
