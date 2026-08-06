'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, BarChart3, Settings, LogOut, Search, AlertTriangle, Link2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signOut } from '@/services/authService';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const isActive = (href: string) => pathname === href;

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Shield },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/alerts', label: 'Alerts', icon: AlertTriangle },
    { href: '/ledger', label: 'SecureChain Ledger', icon: Link2 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      router.replace('/login');
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
    <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-500/20 bg-slate-900/40 backdrop-blur-sm lg:flex lg:flex-col">
      {/* Header */}
      <div className="border-b border-slate-500/20 p-6">
        <div className="flex items-center gap-3">
          <div className="sentinel-signal flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">SentinelID</h1>
            <p className="text-xs text-slate-400">Identity Trust Platform</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="border-b border-slate-500/20 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search identities..."
            className="w-full rounded-lg bg-slate-800/50 py-2 pl-10 pr-4 text-sm text-foreground placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`sentinel-surface flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
              isActive(href)
                ? 'bg-blue-600/20 text-blue-400'
                : 'text-slate-300 hover:bg-slate-800/50 hover:text-foreground'
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-500/20 p-4">
        <button onClick={handleLogout} disabled={loggingOut} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/50 hover:text-foreground disabled:opacity-50">
          <LogOut className="h-5 w-5" />
          {loggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </aside>
    <nav aria-label="Mobile navigation" className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-6 rounded-2xl border border-slate-500/20 bg-slate-900/90 p-1 shadow-2xl backdrop-blur-lg lg:hidden">
      {menuItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          aria-label={label}
          className={`flex min-h-12 items-center justify-center rounded-xl transition-colors ${isActive(href) ? 'bg-blue-600/25 text-blue-300' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
        >
          <Icon className="h-5 w-5" />
        </Link>
      ))}
      <button
        type="button"
        aria-label="Log out"
        onClick={handleLogout}
        disabled={loggingOut}
        className="flex min-h-12 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-50"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </nav>
    </>
  );
}
