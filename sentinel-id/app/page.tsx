'use client';

import Link from 'next/link';
import { Shield, ArrowRight, Lock, Eye, Zap, CheckCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <nav className="sentinel-enter sticky top-0 z-50 border-b border-slate-500/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="sentinel-signal flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">SentinelID</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-foreground/80 transition-colors hover:text-foreground">
              Sign In
            </Link>
            <Link href="/login" className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="sentinel-enter-delay max-w-3xl">
          <h1 className="mb-6 text-5xl font-bold leading-tight text-white">
            Enterprise Identity Trust, Built for Banking Security
          </h1>
          <p className="mb-8 text-xl leading-relaxed text-foreground/70">
            SentinelID answers the question every SOC analyst needs answered: &quot;Should this identity be trusted?&quot;
            Detect identity threats before fraud occurs with AI-powered trust scoring.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700">
              Launch SOC Dashboard
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="#features" className="rounded-lg border border-slate-500/30 px-8 py-3 font-medium text-foreground transition-colors hover:bg-slate-800/50">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-16 text-center text-3xl font-bold text-white">Core Capabilities</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="sentinel-surface rounded-xl border border-slate-500/30 bg-slate-500/5 p-8">
            <Lock className="mb-4 h-8 w-8 text-blue-500" />
            <h3 className="mb-3 text-lg font-semibold text-white">Trust Score Engine</h3>
            <p className="text-foreground/70">AI-powered identity scoring (0-100) that immediately answers whether an identity should be trusted.</p>
          </div>
          <div className="sentinel-surface rounded-xl border border-slate-500/30 bg-slate-500/5 p-8">
            <Eye className="mb-4 h-8 w-8 text-blue-500" />
            <h3 className="mb-3 text-lg font-semibold text-white">Real-Time Monitoring</h3>
            <p className="text-foreground/70">Impossible travel detection, anomalous access patterns, and threat intelligence correlation.</p>
          </div>
          <div className="sentinel-surface rounded-xl border border-slate-500/30 bg-slate-500/5 p-8">
            <Zap className="mb-4 h-8 w-8 text-blue-500" />
            <h3 className="mb-3 text-lg font-semibold text-white">SOC Integration</h3>
            <p className="text-foreground/70">Built for security operations centers with enterprise terminology and workflow optimization.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="mb-8 text-3xl font-bold text-white">Detect Threats Before They Become Fraud</h2>
            <ul className="space-y-4">
              {[
                'Impossible travel scenario detection across 180+ countries',
                'Device fingerprint integrity analysis and compromise detection',
                'Multi-factor authentication bypass risk assessment',
                'Cryptographic verification with real-time validation',
                'Threat intelligence correlation with APT campaigns',
              ].map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-foreground/80">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="sentinel-surface rounded-xl border border-slate-500/30 bg-slate-500/5 p-12">
            <div className="text-center">
              <div className="mb-3 text-6xl font-bold text-blue-500">92%</div>
              <p className="mb-8 text-foreground/70">Average trust score accuracy across financial institutions</p>
              <div className="text-center">
                <div className="mb-2 text-lg font-semibold text-white">Deploy in Minutes</div>
                <p className="text-sm text-foreground/60">No infrastructure changes required. Native banking security integration.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="sentinel-surface rounded-2xl border border-slate-500/30 bg-gradient-to-r from-blue-600/20 to-slate-500/5 p-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Ready to Strengthen Your Identity Security?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-foreground/70">Join enterprise banks that trust SentinelID to protect customer identities and prevent fraud.</p>
          <Link href="/login" className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700">
            Access SOC Dashboard
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <footer className="mt-24 border-t border-slate-500/20 py-12">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-foreground/60">
          <p>Copyright 2025 SentinelID. Enterprise identity security for banking systems worldwide.</p>
        </div>
      </footer>
    </div>
  );
}
