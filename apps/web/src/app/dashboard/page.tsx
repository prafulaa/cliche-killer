"use client";

import React, { useEffect, useState } from 'react';
import { getUser } from '@/lib/api';
import { User } from '@cliche-killer/shared';
import { Ghost, CreditCard, BarChart3, Settings, LogOut, Loader2, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getUser().then(u => {
      if (!u) {
        router.push('/login');
      } else {
        setUser(u);
      }
      setLoading(false);
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const usageLimit = user.subscriptionTier === 'pro' ? 'Unlimited' : '50';
  const usagePercent = user.subscriptionTier === 'pro' ? 0 : Math.min(100, (user.analysesUsed / 50) * 100);

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Sidebar-ish Navbar */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Ghost className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg">Cliché Killer</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/analyze" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Editor</Link>
          <button onClick={handleLogout} className="text-sm font-medium text-red-400/60 hover:text-red-400 transition-colors flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 md:p-10 space-y-10">
        <header>
          <h1 className="text-3xl font-bold mb-2">Welcome, {user.email}</h1>
          <p className="text-white/40">Manage your account and track your writing health.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Usage Card */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/30">Usage</span>
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-2xl font-bold">{user.analysesUsed}</span>
                <span className="text-sm text-white/40">/ {usageLimit} scans</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000" 
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Subscription Card */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/30">Plan</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold capitalize">{user.subscriptionTier}</h3>
              <p className="text-sm text-white/40">Status: Active</p>
            </div>
            {user.subscriptionTier === 'free' && (
              <Link href="/pricing" className="block w-full py-2 bg-primary text-white text-center rounded-lg text-sm font-bold hover:bg-primary/90 transition-all">
                Upgrade to Pro
              </Link>
            )}
          </div>

          {/* Settings Card */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-white/40">
                <Settings className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/30">Settings</span>
            </div>
            <div className="space-y-2">
              <button 
                onClick={async () => {
                  const token = localStorage.getItem('auth_token');
                  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/billing/portal`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                  });
                  const data = await res.json();
                  if (data.url) window.location.href = data.url;
                }}
                className="w-full flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-white/40" />
                  <span className="text-sm">Manage Billing</span>
                </div>
                <CreditCard className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity (Placeholder for future saved analyses) */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Recent Scans</h2>
          <div className="glass-card p-10 text-center space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
              <Ghost className="w-8 h-8 text-white/10" />
            </div>
            <p className="text-white/40">No recent scans saved. Scans are saved automatically on Pro tier.</p>
            <Link href="/analyze" className="inline-block px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-all">
              Start New Scan
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
