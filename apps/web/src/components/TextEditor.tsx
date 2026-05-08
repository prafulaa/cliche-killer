"use client";

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Extension } from '@tiptap/core';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Cliche } from '@cliche-killer/shared';
import { cn } from '@/lib/utils';
import { Sparkles, Trash2, Copy, Check } from 'lucide-react';

// Custom TipTap extension for Cliché Highlighting
const ClicheHighlight = Extension.create({
  name: 'clicheHighlight',

  addOptions() {
    return {
      cliches: [] as Cliche[],
    };
  },

  addCommands() {
    return {
      setCliches: (cliches: Cliche[]) => ({ editor }: { editor: any }) => {
        this.options.cliches = cliches;
        // Trigger a state change to refresh decorations
        editor.view.dispatch(editor.state.tr);
        return true;
      },
    } as any;
  },

  addProseMirrorPlugins() {
    const { cliches } = this.options;
    
    return [
      new Plugin({
        key: new PluginKey('clicheHighlight'),
        props: {
          decorations(state) {
            if (!cliches.length) return DecorationSet.empty;
            
            const doc = state.doc;
            const text = doc.textBetween(0, doc.content.size, ' ');
            const decorations: Decoration[] = [];

            cliches.forEach((cliche: Cliche) => {
              const regex = new RegExp(`\\b${cliche.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
              let match;
              while ((match = regex.exec(text)) !== null) {
                // Find actual position in doc (textBetween might shift positions if there are nodes, but for plain text it's 1:1)
                // Note: state.doc.textBetween indices start at 0, doc positions start at 1.
                const start = match.index + 1;
                const end = start + match[0].length;
                
                decorations.push(
                  Decoration.inline(start, end, {
                    class: 'cliche-highlight',
                    'data-phrase': match[0],
                  })
                );
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

interface TextEditorProps {
  text: string;
  setText: (text: string) => void;
  cliches: Cliche[];
  onAnalyze: () => void;
  loading: boolean;
  onFix: (phrase: string, replacement: string) => void;
}

export function TextEditor({ text, setText, cliches, onAnalyze, loading, onFix }: TextEditorProps) {
  const [copied, setCopied] = React.useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Paste your draft here and kill the clichés...',
      }),
      ClicheHighlight.configure({
        cliches,
      }),
    ],
    content: text,
    onUpdate: ({ editor }) => {
      setText(editor.getText());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[400px] p-6 font-mono text-base text-white/90 leading-relaxed',
      },
      handleDOMEvents: {
        click: (view, event) => {
          const target = event.target as HTMLElement;
          if (target.classList.contains('cliche-highlight')) {
            const phrase = target.getAttribute('data-phrase');
            const cliche = cliches.find(c => c.phrase.toLowerCase() === phrase?.toLowerCase());
            if (cliche) {
              onFix(cliche.phrase, cliche.alternatives[0]);
            }
          }
          return false;
        }
      }
    },
  });

  // Update extension options when cliches change
  useEffect(() => {
    if (editor && (editor.commands as any).setCliches) {
      (editor.commands as any).setCliches(cliches);
    }
  }, [cliches, editor]);

  // Sync external text changes to editor
  useEffect(() => {
    if (editor && text !== editor.getText()) {
      editor.commands.setContent(text, { emitUpdate: false });
    }
  }, [text, editor]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
    editor?.commands.clearContent();
  };

  // Function to apply highlights based on clichés
  // In a real TipTap setup, this would be a custom Extension/Plugin.
  // For now, we'll use a simplified version that wraps phrases in the editor.
  useEffect(() => {
    if (!editor || !cliches.length) return;

    // This is a simplified approach for the MVP. 
    // Ideally, we'd use ProseMirror Decorations to avoid modifying the document content.
  }, [cliches, editor]);

  return (
    <div className="flex flex-col h-full glass-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-white/70">Professional Editor</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="p-2 hover:bg-white/10 rounded-md transition-colors text-white/50 hover:text-white"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-white/10 rounded-md transition-colors text-white/50 hover:text-white"
            title="Copy"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-transparent relative">
        <EditorContent editor={editor} />
        
        {/* CSS for TipTap Highlights */}
        <style jsx global>{`
          .ProseMirror p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: rgba(255, 255, 255, 0.1);
            pointer-events: none;
            height: 0;
          }
          .cliche-highlight {
            background-color: rgba(225, 29, 72, 0.2);
            border-bottom: 2px solid #e11d48;
            border-radius: 2px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .cliche-highlight:hover {
            background-color: rgba(225, 29, 72, 0.4);
          }
        `}</style>
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
