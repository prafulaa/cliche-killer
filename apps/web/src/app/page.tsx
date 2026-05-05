import Link from 'next/link';
import { Ghost, ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-50" />
      
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Ghost className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">Cliché Killer</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/login" className="hover:text-white transition-colors">Login</Link>
          <Link href="/analyze" className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary/80 mb-4">
            <Sparkles className="w-3 h-3" />
            <span>Now with Claude-3.5 Nuanced Detection</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.1]">
            Kill the <span className="gradient-text">AI Clichés</span> <br />
            in your writing.
          </h1>
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed">
            Stop sounding like a robot. Detect and eliminate overused AI phrases 
            in seconds and reclaim your authentic human voice.
          </p>
          <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/analyze" className="w-full md:w-auto px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group">
              Start Scanning for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-sm text-white/30">No credit card required. First 5 scans are on us.</p>
          </div>
        </div>

        {/* Feature Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
          <div className="glass-card p-8 space-y-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold">Instant Detection</h3>
            <p className="text-white/40 leading-relaxed">
              Our pattern-matching engine identifies 500+ overused AI phrases in under 2 seconds.
            </p>
          </div>
          <div className="glass-card p-8 space-y-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold">Human Alternatives</h3>
            <p className="text-white/40 leading-relaxed">
              Don't just delete—replace. Get 3+ human-sounding suggestions for every flagged cliché.
            </p>
          </div>
          <div className="glass-card p-8 space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Health Score</h3>
            <p className="text-white/40 leading-relaxed">
              Get an originality score from 0-100. Aim for the green to ensure your voice is unique.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/20">
        <div className="flex items-center gap-2 opacity-50">
          <Ghost className="w-5 h-5" />
          <span className="font-bold">Cliché Killer</span>
        </div>
        <div className="flex gap-8">
          <Link href="/tos" className="hover:text-white/40 transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-white/40 transition-colors">Privacy</Link>
          <Link href="https://twitter.com/killcliches" className="hover:text-white/40 transition-colors">Twitter</Link>
        </div>
        <p>© 2024 Cliché Killer. All rights reserved.</p>
      </footer>
    </div>
  );
}
