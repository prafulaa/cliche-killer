"use client";

import React, { useState, useMemo } from 'react';
import { Cliche } from '@cliche-killer/shared';
import { cn } from '@/lib/utils';
import { Sparkles, Trash2, Copy, Check } from 'lucide-react';

interface TextEditorProps {
  text: string;
  setText: (text: string) => void;
  cliches: Cliche[];
  onAnalyze: () => void;
  loading: boolean;
  onFix: (phrase: string, replacement: string) => void;
}

export function TextEditor({ text, setText, cliches, onAnalyze, loading, onFix }: TextEditorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedContent = useMemo(() => {
    if (!cliches.length) return text;

    let result = text;
    // Sort cliches by length descending to avoid partial matches within longer cliches
    const sortedCliches = [...cliches].sort((a, b) => b.phrase.length - a.phrase.length);

    // This is a simple replacement for display. In a production app, 
    // we'd use a more robust way to handle overlaps and positions.
    sortedCliches.forEach((cliche) => {
      const regex = new RegExp(`\\b${cliche.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      result = result.replace(regex, (match) => `<mark class="cliche-highlight" data-phrase="${match}">${match}</mark>`);
    });

    return result;
  }, [text, cliches]);

  return (
    <div className="flex flex-col h-full glass-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-white/70">Editor</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setText('')}
            className="p-2 hover:bg-white/10 rounded-md transition-colors text-white/50 hover:text-white"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-white/10 rounded-md transition-colors text-white/50 hover:text-white"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="relative flex-1 min-h-0">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your draft here..."
          className={cn(
            "w-full h-full p-6 bg-transparent text-white/90 font-mono text-base resize-none focus:outline-none custom-scrollbar",
            cliches.length > 0 ? "opacity-0 absolute inset-0 z-0" : "opacity-100 relative z-10"
          )}
        />
        
        {cliches.length > 0 && (
          <div 
            className="absolute inset-0 p-6 font-mono text-base text-white/90 overflow-y-auto custom-scrollbar whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{ __html: highlightedContent }}
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target.tagName === 'MARK') {
                const phrase = target.getAttribute('data-phrase');
                const cliche = cliches.find(c => c.phrase.toLowerCase() === phrase?.toLowerCase());
                if (cliche) {
                  // In a real app, this would trigger the suggestion modal
                  // For now, we'll just fix with the first alternative
                  onFix(cliche.phrase, cliche.alternatives[0]);
                }
              }
            }}
          />
        )}
      </div>

      <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end">
        <button
          onClick={onAnalyze}
          disabled={loading || !text.trim()}
          className={cn(
            "px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2",
            loading || !text.trim() 
              ? "bg-white/10 text-white/30 cursor-not-allowed" 
              : "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
          )}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Scan for Clichés
            </>
          )}
        </button>
      </div>
    </div>
  );
}
