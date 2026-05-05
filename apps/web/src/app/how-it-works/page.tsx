"use client";

import React from 'react';
import { Ghost, ArrowRight, Zap, ShieldCheck, Sparkles, Copy, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  const steps = [
    {
      title: "Paste your Draft",
      description: "Drop your 1,000–10,000 word draft into our minimalist editor. We support plain text and standard web formatting.",
      icon: <Copy className="w-6 h-6 text-blue-400" />,
      color: "bg-blue-500/10"
    },
    {
      title: "Instant Scan",
      description: "Our engine scans for 500+ overused AI patterns—everything from 'delve into' to 'in today's landscape'—in under 2 seconds.",
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      color: "bg-yellow-500/10"
    },
    {
      title: "Review Highlights",
      description: "See every cliché highlighted in red. Hover over a phrase to see why it's flagged and how it affects your health score.",
      icon: <ShieldCheck className="w-6 h-6 text-red-400" />,
      color: "bg-red-500/10"
    },
    {
      title: "One-Click Fix",
      description: "Choose from 3+ human alternatives for every flagged phrase. Click a suggestion to instantly update your text.",
      icon: <Sparkles className="w-6 h-6 text-primary" />,
      color: "bg-primary/10"
    },
    {
      title: "Export & Ship",
      description: "Once your score hits green, copy your cleaned text or export it. Your writing is now authentic, sharp, and purely you.",
      icon: <ArrowRight className="w-6 h-6 text-green-400" />,
      color: "bg-green-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">How it <span className="gradient-text">Works</span></h1>
          <p className="text-xl text-white/40">From AI-fluff to human-sharp in five simple steps.</p>
        </div>

        <div className="space-y-12">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center gap-8 glass-card p-8"
            >
              <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center ${step.color}`}>
                {step.icon}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <span className="text-primary font-mono font-bold">0{idx + 1}</span>
                  <h3 className="text-2xl font-bold">{step.title}</h3>
                </div>
                <p className="text-white/50 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center glass-card p-12 border-primary/20">
          <h2 className="text-3xl font-bold mb-6">Ready to reclaim your voice?</h2>
          <a href="/analyze" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
            Start Your First Scan
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
