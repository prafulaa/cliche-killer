"use client";

import React, { useState } from 'react';
import { TextEditor } from '@/components/TextEditor';
import { SidePanel } from '@/components/SidePanel';
import { analyzeText } from '@/lib/api';
import { Analysis } from '@cliche-killer/shared';
import { Ghost, ShieldAlert, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnalyzePage() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeText(text);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFix = (phrase: string, replacement: string) => {
    const regex = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const newText = text.replace(regex, replacement);
    setText(newText);
    
    // Update local analysis state to remove the fixed cliche
    if (analysis) {
      const newClicheList = analysis.clicheList.filter(c => c.phrase.toLowerCase() !== phrase.toLowerCase());
      setAnalysis({
        ...analysis,
        clichesFound: newClicheList.reduce((sum, c) => sum + (c.count || 0), 0),
        clicheList: newClicheList,
      });
    }
  };

  const handleAutoFix = () => {
    if (!analysis) return;
    
    let newText = text;
    analysis.clicheList.forEach(cliche => {
      const regex = new RegExp(`\\b${cliche.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      newText = newText.replace(regex, cliche.alternatives[0]);
    });
    
    setText(newText);
    setAnalysis(null); // Clear analysis after auto-fix to encourage re-scan
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-6 md:p-10">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Ghost className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Cliché Killer</h1>
            <p className="text-sm text-white/40">Phase 1: Detect & Eradicate</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs text-white/30 uppercase tracking-widest">Free Tier</span>
            <span className="text-sm font-medium text-white/60">5/50 scans used</span>
          </div>
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium text-white transition-colors border border-white/10">
            Upgrade to Pro
          </button>
        </div>
      </header>

      <main className="flex-1 flex gap-6 min-h-0">
        {/* Editor Area */}
        <div className="flex-1 min-w-0">
          <TextEditor
            text={text}
            setText={setText}
            cliches={analysis?.clicheList || []}
            onAnalyze={handleAnalyze}
            loading={loading}
            onFix={handleFix}
          />
        </div>

        {/* Sidebar Area */}
        <div className="hidden lg:block">
          <AnimatePresence mode="wait">
            {analysis ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full"
              >
                <SidePanel
                  analysis={analysis}
                  onFix={handleFix}
                  onAutoFix={handleAutoFix}
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-80 h-full glass-card p-8 flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-white/20" />
                </div>
                <h3 className="text-lg font-semibold text-white/80 mb-2">Ready to scan</h3>
                <p className="text-sm text-white/40">
                  Paste your text and click scan to see the clichés AI might have left behind.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50"
          >
            <ShieldAlert className="w-5 h-5" />
            <span className="font-medium">{error}</span>
            <button onClick={() => setError(null)} className="ml-2 hover:opacity-70 font-bold">×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
