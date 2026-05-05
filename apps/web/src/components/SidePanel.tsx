"use client";

import React from 'react';
import { Analysis, Cliche } from '@cliche-killer/shared';
import { cn } from '@/lib/utils';
import { AlertTriangle, Info, Zap, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidePanelProps {
  analysis: Analysis;
  onFix: (phrase: string, replacement: string) => void;
  onAutoFix: () => void;
}

export function SidePanel({ analysis, onFix, onAutoFix }: SidePanelProps) {
  const scoreColor = analysis.healthScore > 70 ? 'text-green-400' : analysis.healthScore > 40 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="flex flex-col h-full gap-4 w-80">
      {/* Health Score Card */}
      <div className="glass-card p-6 flex flex-col items-center text-center">
        <span className="text-sm font-medium text-white/50 mb-1">Health Score</span>
        <div className={cn("text-5xl font-bold mb-2", scoreColor)}>
          {analysis.healthScore}
          <span className="text-xl text-white/20">/100</span>
        </div>
        <p className="text-sm text-white/60">
          {analysis.healthScore > 80 ? "Great job! Your writing is mostly original." : 
           analysis.healthScore > 50 ? "Not bad, but could be more human." :
           "Warning: High cliché density detected."}
        </p>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4 flex flex-col">
          <span className="text-xs text-white/40 uppercase tracking-wider mb-1">Found</span>
          <span className="text-xl font-bold text-white">{analysis.clichesFound}</span>
        </div>
        <div className="glass-card p-4 flex flex-col">
          <span className="text-xs text-white/40 uppercase tracking-wider mb-1">Impact</span>
          <span className="text-xl font-bold text-red-400">High</span>
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={onAutoFix}
        className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-medium text-white/80 hover:text-white"
      >
        <Zap className="w-4 h-4 text-yellow-400" />
        Auto-fix all clichés
      </button>

      {/* Cliche List */}
      <div className="glass-card flex-1 min-h-0 flex flex-col">
        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <span className="text-sm font-medium text-white/70">Flagged Phrases</span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-mono text-white/50">
            {analysis.clicheList.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          {analysis.clicheList.map((cliche, idx) => (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={cliche.id + idx}
              className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-red-500/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-medium text-red-400">"{cliche.phrase}"</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-400/70 border border-red-500/20">
                  {cliche.severity}/10
                </span>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs text-white/40 leading-relaxed italic">
                  "{cliche.explanation}"
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cliche.alternatives.slice(0, 2).map((alt, i) => (
                    <button
                      key={i}
                      onClick={() => onFix(cliche.phrase, alt)}
                      className="text-[10px] px-2 py-1 rounded bg-white/5 hover:bg-primary/20 hover:text-primary transition-all border border-white/10"
                    >
                      Use "{alt}"
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
