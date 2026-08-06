'use client';

import { Sidebar } from '@/components/Sidebar';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockAnalyticsData } from '@/lib/mockData';
import { TrendingUp, PieChart as PieChartIcon, AlertTriangle, CheckCircle } from 'lucide-react';

const COLORS = ['#0084ff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="p-4 lg:ml-64 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Identity Analytics & Reporting</h1>
          <p className="text-foreground/60">Historical trends, risk distribution, and compliance metrics</p>
          <p className="mt-2 text-xs text-amber-300">Sample analytics data. Live analytics calculations are not configured.</p>
        </div>

        {/* Key Metrics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-slate-500/30 bg-slate-500/5 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-foreground/60">Avg Trust Score</p>
                <p className="mt-2 text-3xl font-bold text-blue-400">84.6</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="rounded-lg border border-slate-500/30 bg-slate-500/5 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-foreground/60">Blocked Sessions (24h)</p>
                <p className="mt-2 text-3xl font-bold text-red-400">12</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <div className="rounded-lg border border-slate-500/30 bg-slate-500/5 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-foreground/60">Threat Matches</p>
                <p className="mt-2 text-3xl font-bold text-orange-400">3</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-orange-500" />
            </div>
          </div>
          <div className="rounded-lg border border-slate-500/30 bg-slate-500/5 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-foreground/60">Compliance Score</p>
                <p className="mt-2 text-3xl font-bold text-green-400">91%</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Trust Score Trend */}
          <div className="rounded-xl border border-slate-500/30 bg-slate-500/5 p-6">
            <div className="mb-4 flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-slate-400" />
              <h3 className="text-sm font-semibold text-foreground">Trust Score Trend (7 Days)</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockAnalyticsData.trustScoreTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404854" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#0084ff" name="Current Score" strokeWidth={2} />
                <Line type="monotone" dataKey="average" stroke="#64748b" name="7-Day Average" strokeWidth={1} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Category Breakdown */}
          <div className="rounded-xl border border-slate-500/30 bg-slate-500/5 p-6">
            <div className="mb-4 flex items-center gap-3">
              <PieChartIcon className="h-5 w-5 text-slate-400" />
              <h3 className="text-sm font-semibold text-foreground">Risk Category Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockAnalyticsData.riskCategoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockAnalyticsData.riskCategoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts Over Time & Compliance */}
        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Alerts Over Time */}
          <div className="rounded-xl border border-slate-500/30 bg-slate-500/5 p-6">
            <div className="mb-4 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-slate-400" />
              <h3 className="text-sm font-semibold text-foreground">Alerts by Hour</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockAnalyticsData.alertsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404854" />
                <XAxis dataKey="hour" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
                <Bar dataKey="count" fill="#0084ff" name="Total Alerts" />
                <Bar dataKey="critical" fill="#ef4444" name="Critical Alerts" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Compliance Status */}
          <div className="rounded-xl border border-slate-500/30 bg-slate-500/5 p-6">
            <div className="mb-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-slate-400" />
              <h3 className="text-sm font-semibold text-foreground">Regulatory Compliance</h3>
            </div>
            <div className="space-y-4">
              {mockAnalyticsData.complianceStatus.map((item) => (
                <div key={item.regulation}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-foreground/80">{item.regulation}</span>
                    <span className="font-semibold text-green-400">{item.score}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-600"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="rounded-xl border border-slate-500/30 bg-slate-500/5 p-6">
          <h3 className="mb-6 text-sm font-semibold text-foreground">Performance Summary</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-xs text-foreground/60">Detection Accuracy</p>
              <p className="mt-2 text-2xl font-bold text-green-400">94.2%</p>
            </div>
            <div>
              <p className="text-xs text-foreground/60">False Positives (24h)</p>
              <p className="mt-2 text-2xl font-bold text-yellow-400">3</p>
            </div>
            <div>
              <p className="text-xs text-foreground/60">Avg Response Time</p>
              <p className="mt-2 text-2xl font-bold text-blue-400">4.2s</p>
            </div>
            <div>
              <p className="text-xs text-foreground/60">System Uptime</p>
              <p className="mt-2 text-2xl font-bold text-green-400">99.98%</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
