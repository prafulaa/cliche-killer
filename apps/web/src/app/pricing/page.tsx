"use client";

import React, { useState } from 'react';
import { Check, Ghost, Zap, Users, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (plan: string) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    setLoading(plan);
    try {
      const response = await fetch(`${API_URL}/api/billing/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan })
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to start checkout');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      description: 'Perfect for casual writers.',
      features: [
        '50 analyses per month',
        'Basic pattern matching',
        'One-click fixes',
        'Standard health score'
      ],
      buttonText: 'Current Plan',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9',
      description: 'For professional content creators.',
      features: [
        'Unlimited analyses',
        'Claude-3.5 nuanced detection',
        'Browser extension access',
        'Priority support',
        'Advanced health metrics'
      ],
      buttonText: 'Upgrade to Pro',
      popular: true
    },
    {
      id: 'team',
      name: 'Team',
      price: '$29',
      description: 'For agencies and marketing teams.',
      features: [
        'Up to 5 users',
        'Shared usage dashboard',
        'Centralized billing',
        'API access for workflows',
        'Custom cliché lists (coming soon)'
      ],
      buttonText: 'Contact for Team',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background text-white py-20 px-6">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Choose your <span className="gradient-text">Plan</span></h1>
        <p className="text-xl text-white/40 max-w-2xl mx-auto">
          Start for free and upgrade when you need to unlock the full potential of your writing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "glass-card p-8 flex flex-col relative",
              plan.popular && "border-primary/50 shadow-2xl shadow-primary/10 scale-105 z-10"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-white/40 text-sm">/month</span>
              </div>
              <p className="text-sm text-white/40">{plan.description}</p>
            </div>

            <div className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 w-4 h-4 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-500" />
                  </div>
                  <span className="text-sm text-white/70">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => plan.id !== 'free' && handleUpgrade(plan.id)}
              disabled={plan.id === 'free' || (loading !== null)}
              className={cn(
                "w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                plan.id === 'free' 
                  ? "bg-white/5 text-white/20 cursor-not-allowed" 
                  : plan.popular 
                    ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20" 
                    : "bg-white/10 text-white hover:bg-white/20"
              )}
            >
              {loading === plan.id ? <Loader2 className="w-5 h-5 animate-spin" /> : plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
