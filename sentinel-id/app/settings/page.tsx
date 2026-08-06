'use client';

import { Sidebar } from '@/components/Sidebar';
import { User, Bell, Lock, Shield, FileText, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '@/services/profileService';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProfile().then((profile) => {
      setFullName(profile.fullName);
      setEmail(profile.email);
      setJobTitle(profile.jobTitle);
      setDepartment(profile.department);
    }).catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load profile.')).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateProfile({ fullName, jobTitle, department });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="p-4 lg:ml-64 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-foreground/60">Manage your account and security preferences</p>
        </div>

        {/* Save Notification */}
        {saved && (
          <div className="mb-6 rounded-lg bg-green-500/20 border border-green-500/30 p-4 text-sm text-green-400">
            Settings saved successfully
          </div>
        )}
        {error && <div role="alert" className="mb-6 rounded-lg border border-red-500/30 bg-red-500/20 p-4 text-sm text-red-400">{error}</div>}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2 rounded-lg border border-slate-500/30 bg-slate-500/5 p-4">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'security', label: 'Security', icon: Lock },
                { id: 'compliance', label: 'Compliance', icon: Shield },
                { id: 'api', label: 'API Keys', icon: FileText },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  disabled
                  title="This settings area is not configured for the MVP"
                  className="flex w-full cursor-not-allowed items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium opacity-60"
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Settings Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Profile Settings */}
            <div className="rounded-lg border border-slate-500/30 bg-slate-500/5 p-6">
              <h2 className="mb-6 text-xl font-semibold text-foreground">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    disabled={loading}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-foreground focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-foreground focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Job Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(event) => setJobTitle(event.target.value)}
                    disabled={loading}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-foreground focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(event) => setDepartment(event.target.value)}
                    disabled={loading}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-foreground focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="rounded-lg border border-slate-500/30 bg-slate-500/5 p-6">
              <h2 className="mb-6 text-xl font-semibold text-foreground">Notification Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Critical Alerts</p>
                    <p className="text-sm text-foreground/60">Receive notifications for critical threats</p>
                  </div>
                  <input type="checkbox" checked readOnly disabled title="Notifications are not configured for this MVP" className="h-5 w-5 rounded" />
                </div>
                <div className="flex items-center justify-between border-t border-slate-700 pt-4">
                  <div>
                    <p className="font-medium text-foreground">High Priority Alerts</p>
                    <p className="text-sm text-foreground/60">Receive notifications for high-priority threats</p>
                  </div>
                  <input type="checkbox" checked readOnly disabled title="Notifications are not configured for this MVP" className="h-5 w-5 rounded" />
                </div>
                <div className="flex items-center justify-between border-t border-slate-700 pt-4">
                  <div>
                    <p className="font-medium text-foreground">Daily Summary</p>
                    <p className="text-sm text-foreground/60">Receive daily security summary emails</p>
                  </div>
                  <input type="checkbox" checked readOnly disabled title="Notifications are not configured for this MVP" className="h-5 w-5 rounded" />
                </div>
                <div className="flex items-center justify-between border-t border-slate-700 pt-4">
                  <div>
                    <p className="font-medium text-foreground">Weekly Reports</p>
                    <p className="text-sm text-foreground/60">Receive weekly compliance and analytics reports</p>
                  </div>
                  <input type="checkbox" disabled title="Notifications are not configured for this MVP" className="h-5 w-5 rounded" />
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="rounded-lg border border-slate-500/30 bg-slate-500/5 p-6">
              <h2 className="mb-6 text-xl font-semibold text-foreground">Security Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                  <div>
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-foreground/60">Add extra security to your account</p>
                  </div>
                  <button type="button" disabled title="MFA configuration is managed by the authentication provider" className="cursor-not-allowed rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white opacity-50">
                    Enable
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                  <div>
                    <p className="font-medium text-foreground">API Access</p>
                    <p className="text-sm text-foreground/60">Manage API keys for integrations</p>
                  </div>
                  <button type="button" disabled title="API key management is not configured for this MVP" className="cursor-not-allowed rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-foreground opacity-50">
                    Configure
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                  <div>
                    <p className="font-medium text-foreground">Session Management</p>
                    <p className="text-sm text-foreground/60">View and manage active sessions</p>
                  </div>
                  <button type="button" disabled title="Session management is not configured for this MVP" className="cursor-not-allowed rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-foreground opacity-50">
                    Manage
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
              <button className="rounded-lg border border-slate-500/30 px-6 py-2 font-medium text-foreground hover:bg-slate-800/50">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading || saving}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-5 w-5" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
