"use client";

import React, { useState } from 'react';
import { Plus, Minus, Ghost } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQPage() {
  const faqs = [
    {
      question: "What exactly is an 'AI cliché'?",
      answer: "AI clichés are overused phrases and patterns that Large Language Models (like ChatGPT) favor. They include corporate jargon like 'cutting-edge', filler phrases like 'it's crucial to', and flowery metaphors like 'rich tapestry'. These phrases make your writing sound artificial and robotic."
    },
    {
      question: "How accurate is the detection?",
      answer: "Our pattern-matching engine covers over 500+ known AI-generated phrases with 90%+ accuracy. For Pro users, we add a second tier of analysis using Claude-3.5 to catch more nuanced, context-dependent clichés."
    },
    {
      question: "Does this store my writing?",
      answer: "Privacy is a priority. We process your text in-memory during the analysis session. We only save your drafts if you explicitly click 'Save to History'. Otherwise, your data is gone as soon as you close the tab."
    },
    {
      question: "Can I use it on Gmail or LinkedIn?",
      answer: "Yes! Our Chrome Extension (Manifest V3) injects Cliché Killer directly into your favorite editors, including Gmail, LinkedIn, Medium, and WordPress."
    },
    {
      question: "What's the difference between Free and Pro?",
      answer: "Free users get 50 scans per month and standard detection. Pro users get unlimited scans, Claude-powered nuanced detection, browser extension access, and priority support."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-white py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ghost className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Common <span className="gradient-text">Questions</span></h1>
          <p className="text-xl text-white/40">Everything you need to know about killing clichés.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <span className="text-lg font-semibold text-white/80">{question}</span>
        {isOpen ? <Minus className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-white/20" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-6 text-white/40 leading-relaxed text-sm"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
