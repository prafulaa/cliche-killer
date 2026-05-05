# Cliché-Free Writing Enforcer — Master Build Prompt (A to Z)

> **How to use this document:** Paste this entire prompt into Claude Code (or any agentic coding assistant) at the root of an empty repo. The agent has everything it needs to build the full product end-to-end. Each phase has clear acceptance criteria — do not move to the next phase until the current one passes its tests.

---

## 1. PROJECT MISSION

Build a production-ready Pico-SaaS web application called **Cliché Killer** that detects and helps writers eliminate the overused, AI-generated phrases that have flooded digital content, allowing them to maintain a purely human, authentic voice.

**The Magic Moment:**
A writer pastes their draft into a minimalist web interface. In 2 seconds, they see every clichéd phrase highlighted in red — *"in today's landscape,"* *"it's crucial to,"* *"cutting-edge solutions"* — with one-click suggestions to replace them with direct, human-sounding alternatives. They don't need to learn anything. They paste, see red, click fix, done.

**Core principle:** The tool is hyper-opinionated. It doesn't try to improve all writing; it exists solely to strip out low-value, overused AI patterns. This specificity is its strength.

---

## 2. PRIMARY USER FLOWS

### Flow A — Writer Checks a Draft (the 95% path)
1. Writer goes to `killcliches.com` (or your domain)
2. Pastes their draft (1,000–10,000 words) into a large text area
3. Clicks **"Scan for Clichés"**
4. System analyzes in real-time: highlights every flagged phrase in red inline
5. Writer sees a sidebar showing:
   - **47 clichés found**
   - List of top offenders: "in today's landscape" (5x), "cutting-edge" (3x), "it's crucial to" (2x)
   - Health score: **23/100** (0 = pure cliché, 100 = original)
6. Writer clicks a red phrase → modal suggests 3 alternatives
7. Writer clicks the replacement they like → text updates live
8. Writer can hit **"Auto-fix all"** to accept top suggestion for every cliché
9. Writer can export cleaned text or copy to clipboard

### Flow B — Browser Extension Usage (secondary, desktop only)
1. Writer installs **Cliché Killer extension** from Chrome Web Store
2. Opens any text box in Gmail, LinkedIn, Medium, Notion, WordPress, Substack, etc.
3. Small icon appears in top-right of text area
4. Writer clicks icon → modal opens with analysis of current text
5. Suggestions appear inline; clicking a suggestion updates the text box
6. Writer saves their draft with clichés removed

### Flow C — API Usage (power users only)
1. Developer integrates `POST /api/analyze` into their own platform
2. Sends text + API key
3. Gets back JSON with flagged phrases, positions, severity scores, suggestions
4. Renders UI however they want in their app

### Flow D — Account & Subscription
1. First 5 analyses free
2. After 5: prompted to sign up (email only, no password)
3. Free tier: 50 analyses/month
4. Pro: $9/month unlimited analyses + browser extension + API access
5. Team: $29/month up to 5 users + usage dashboard
6. Email login (magic link, no password)

---

## 3. TECH STACK (LOCKED — DO NOT SUBSTITUTE)

| Layer | Choice | Reason |
|-------|--------|--------|
| Backend | Node.js 20 + Express | Simple, fast, easy to deploy |
| NLP/Detection | Pattern matching (JSON db) + Anthropic API | Hybrid: fast regex for 80% of cases, Claude API for nuanced detection |
| Database | Supabase (Postgres) + JSON for phrase db | Free tier sufficient, JSON storage for cliché patterns |
| Frontend | Next.js 14 (App Router) + Tailwind CSS | SSR for SEO, great DX, component reuse |
| Text Editor | TipTap (Tiptap editor) or vanilla textarea + line-by-line markup | Lightweight, custom highlighting, no dependencies |
| Browser Extension | Manifest V3 | Chrome, Edge, Brave, Arc support |
| Auth | Supabase Auth (magic link via email) | No passwords, passwordless, frictionless |
| File Storage | No external storage needed (all in-memory during session) | Simplicity |
| Backend hosting | Railway or Render | Auto-deploy, simple, cheap |
| Frontend hosting | Vercel | Free, optimal for Next.js, fast CDN |
| Domain | `killcliches.com` (or similar) | Buy from Namecheap |
| Monitoring | Sentry (free tier) | Error tracking |
| Email | Resend | For magic link emails, usage reports |
| Analytics | Plausible (privacy-first) | Simple, no cookie banners |

---

## 4. FILE / FOLDER STRUCTURE

```
cliche-killer/
├── apps/
│   ├── api/                          # Express backend
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── analyze.ts        # Main cliché detection endpoint
│   │   │   │   ├── auth.ts           # Magic link endpoints
│   │   │   │   ├── usage.ts          # Check usage quota
│   │   │   │   ├── extension.ts      # Browser extension API
│   │   │   │   └── health.ts         # Health check
│   │   │   ├── services/
│   │   │   │   ├── clicheDetector.ts # Core detection logic (pattern + API)
│   │   │   │   ├── phraseDb.ts       # Load + manage cliché phrase database
│   │   │   │   ├── anthropicClient.ts # Claude API wrapper
│   │   │   │   └── emailService.ts   # Send magic links via Resend
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts           # JWT validation
│   │   │   │   ├── rateLimit.ts      # Per-IP + per-user rate limiting
│   │   │   │   └── errorHandler.ts   # Structured error responses
│   │   │   ├── db/
│   │   │   │   ├── client.ts         # Supabase client
│   │   │   │   └── migrations/       # SQL migrations
│   │   │   └── server.ts
│   │   ├── data/
│   │   │   └── cliches.json          # Master list of 500+ AI clichés + alternatives
│   │   ├── tests/
│   │   └── package.json
│   │
│   ├── web/                          # Next.js frontend
│   │   ├── app/
│   │   │   ├── (marketing)/
│   │   │   │   ├── page.tsx          # Landing page
│   │   │   │   ├── how-it-works/page.tsx
│   │   │   │   ├── pricing/page.tsx
│   │   │   │   └── faq/page.tsx
│   │   │   ├── (app)/
│   │   │   │   ├── analyze/page.tsx  # Main editor (PRIVATE)
│   │   │   │   ├── login/page.tsx    # Magic link login
│   │   │   │   ├── dashboard/page.tsx # Usage stats
│   │   │   │   └── settings/page.tsx
│   │   │   └── api/
│   │   │       └── auth/[...auth]/route.ts
│   │   ├── components/
│   │   │   ├── TextEditor.tsx        # Main textarea + highlighting
│   │   │   ├── ClicheHighlighter.tsx # Renders red highlights
│   │   │   ├── SidePanel.tsx         # Stats + cliché list
│   │   │   ├── SuggestionModal.tsx   # 3 alternatives per phrase
│   │   │   └── ui/                   # shadcn/ui
│   │   ├── lib/
│   │   │   ├── api.ts                # Fetch wrapper
│   │   │   ├── supabase.ts
│   │   │   └── types.ts
│   │   └── package.json
│   │
│   └── extension/                    # Chrome extension (Manifest V3)
│       ├── manifest.json
│       ├── popup.html
│       ├── popup.tsx                 # Modal that opens on click
│       ├── content.ts                # Inject into page + detect textareas
│       ├── background.ts             # Handle messages
│       └── styles.css
│
├── packages/
│   └── shared/
│       └── types.ts                  # Shared types: Cliche, Analysis, etc.
│
├── .env.example
├── README.md
└── package.json (workspace root)
```

---

## 5. CLICHÉ DATABASE STRUCTURE

### File: `apps/api/data/cliches.json`

The core asset. A JSON file with 500+ known AI clichés, grouped by category, with severity and suggested alternatives.

```json
{
  "cliches": [
    {
      "id": "c001",
      "phrase": "in today's landscape",
      "category": "business",
      "severity": 9,
      "matchType": "exact",
      "alternatives": [
        "currently",
        "these days",
        "right now"
      ],
      "explanation": "Overused in AI-generated business writing. Vague and corporate."
    },
    {
      "id": "c002",
      "phrase": "cutting-edge",
      "category": "tech",
      "severity": 8,
      "matchType": "word",
      "alternatives": [
        "latest",
        "new",
        "state-of-the-art"
      ],
      "explanation": "Lazy adjective favored by AI. Show, don't tell."
    },
    {
      "id": "c003",
      "phrase": "it's crucial to",
      "category": "business",
      "severity": 7,
      "matchType": "phrase",
      "alternatives": [
        "[verb] directly",
        "[verb] without delay",
        "you must [verb]"
      ],
      "explanation": "Filler phrase that adds no value. Be more specific."
    },
    {
      "id": "c004",
      "phrase": "unlocking the potential",
      "category": "business",
      "severity": 9,
      "matchType": "phrase",
      "alternatives": [
        "realizing value",
        "making progress",
        "achieving goals"
      ],
      "explanation": "Peak corporate cliché. Meaningless."
    },
    {
      "id": "c005",
      "phrase": "a game-changer",
      "category": "tech",
      "severity": 8,
      "matchType": "phrase",
      "alternatives": [
        "transformative",
        "disruptive",
        "significant"
      ],
      "explanation": "Overused to death. Show impact concretely."
    }
  ]
}
```

### Matching strategy
- **Exact:** `"in today's landscape"` → only match if exact case-insensitive substring
- **Word:** `"cutting-edge"` → match word boundaries (hyphenated counts as one word)
- **Phrase:** `"it's crucial to"` → match substring with word boundaries

### Size target
Aim for 500–800 clichés covering:
- Business jargon (30%)
- Tech/startup (25%)
- Academic fluff (20%)
- Marketing speak (15%)
- Other (10%)

---

## 6. DATABASE SCHEMA (Supabase / Postgres)

```sql
-- users: writers who've signed up
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscription_tier TEXT DEFAULT 'free', -- 'free' | 'pro' | 'team'
  analyses_used INT DEFAULT 0,           -- rolling counter for this month
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- analyses: each time user checks a draft
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,             -- original draft
  output_text TEXT,                     -- cleaned version (if user saves)
  cliches_found INT NOT NULL,           -- count of clichés detected
  health_score INT,                     -- 0-100 originality score
  cliche_list JSONB NOT NULL,           -- array of {phrase, count, alternatives}
  status TEXT DEFAULT 'analyzed',       -- 'analyzed' | 'saved'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analyses_user ON analyses(user_id);
CREATE INDEX idx_analyses_created ON analyses(created_at DESC);

-- api_keys: for extension + third-party API access
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key TEXT UNIQUE NOT NULL,             -- random 32-char string
  name TEXT,                            -- "Chrome Extension" or user's label
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- usage_log: track API calls for rate limiting + analytics
CREATE TABLE usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  ip_address INET,
  endpoint TEXT,
  status_code INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_usage_log_user_date ON usage_log(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own data
CREATE POLICY "users_self" ON users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "analyses_owned" ON analyses
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "api_keys_owned" ON api_keys
  FOR ALL USING (user_id = auth.uid());
```

---

## 7. CORE DETECTION LOGIC (`services/clicheDetector.ts`)

### Two-tier detection strategy

**Tier 1: Fast pattern matching (handles 80% of cases)**
```typescript
// Load cliches.json at startup
const phraseDb = loadClichesFromJson();

function detectClichesFast(text: string): Cliche[] {
  const results: Cliche[] = [];
  const lowerText = text.toLowerCase();
  
  for (const cliche of phraseDb.cliches) {
    // Regex-based matching by matchType
    let regex: RegExp;
    if (cliche.matchType === 'exact') {
      regex = new RegExp(`\\b${escapeRegex(cliche.phrase)}\\b`, 'gi');
    } else if (cliche.matchType === 'word') {
      // Single word, any case
      regex = new RegExp(`\\b${escapeRegex(cliche.phrase)}\\b`, 'gi');
    } else {
      // Phrase: word boundaries on start/end
      regex = new RegExp(`\\b${escapeRegex(cliche.phrase)}\\b`, 'gi');
    }
    
    const matches = lowerText.match(regex);
    if (matches) {
      results.push({
        ...cliche,
        count: matches.length,
        positions: findPositions(text, cliche.phrase) // char offsets
      });
    }
  }
  
  return results.sort((a, b) => b.severity - a.severity);
}
```

**Tier 2: Claude API for nuanced edge cases**
```typescript
async function detectClicherNuanced(text: string, fastResults: Cliche[]): Promise<Cliche[]> {
  // Only use API if:
  // - Text is short (< 2000 chars, cheap to analyze)
  // - User is on Pro tier
  // - Rate limit not hit
  
  if (text.length > 2000 || user.tier === 'free') {
    return fastResults; // Skip Claude, fast results only
  }
  
  const prompt = `You are a writing editor specializing in detecting AI-generated phrases. 
Analyze this text and identify phrases that sound artificial, overused, or AI-like:

"${text}"

Return ONLY a JSON array: 
[
  { "phrase": "exact phrase from text", "reason": "why it's clichéd" },
  ...
]

Focus on: corporate jargon, meaningless buzzwords, overused metaphors, corporate speak.`;

  const response = await anthropic.messages.create({
    model: "claude-opus-4-20250514",
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }]
  });
  
  // Parse response, merge with fastResults, deduplicate
  const claudeSuggestions = parseJSON(response.content[0].text);
  return mergeResults(fastResults, claudeSuggestions);
}
```

### Health Score Calculation
```typescript
function calculateHealthScore(text: string, cliches: Cliche[]): number {
  const wordCount = text.split(/\s+/).length;
  const clicheWordCount = cliches.reduce((sum, c) => sum + (c.phrase.split(' ').length * c.count), 0);
  
  const clicheRatio = clicheWordCount / wordCount;
  const score = Math.max(0, 100 - Math.floor(clicheRatio * 100));
  
  return Math.min(100, score);
}
```

---

## 8. API ENDPOINTS

### Public (no auth)
- `POST /api/analyze` — analyze text (requires quota check, rate limit by IP)
- `POST /api/auth/request-magic-link` — send magic link to email
- `GET /api/auth/verify?token=...` — verify token, set JWT

### Authenticated (JWT required)
- `GET /api/user/me` — current user profile + usage
- `POST /api/analyze-save` — save an analysis to history
- `GET /api/analyses` — list past analyses (paginated)
- `GET /api/analyses/:id` — fetch single analysis detail
- `POST /api/api-keys` — create new API key
- `GET /api/api-keys` — list API keys
- `DELETE /api/api-keys/:id` — revoke API key
- `GET /api/usage` — current month usage stats
- `POST /api/upgrade` — create Stripe checkout session
- `GET /api/billing/portal` — manage subscription

### Webhook (Stripe)
- `POST /api/stripe/webhook` — subscription events

---

## 9. TEXT EDITOR & HIGHLIGHTING COMPONENT

### Frontend: `components/TextEditor.tsx`

```typescript
import React, { useState } from 'react';
import TipTap from '@tiptap/react';

export function TextEditor() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    }).then(r => r.json());
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="flex h-screen">
      {/* Left: Editor */}
      <div className="flex-1 p-6 border-r">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-96 p-4 border rounded font-mono text-sm"
          placeholder="Paste your draft here..."
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded font-semibold"
        >
          {loading ? 'Analyzing...' : 'Scan for Clichés'}
        </button>
      </div>

      {/* Right: Results */}
      {analysis && (
        <SidePanel
          analysis={analysis}
          onFix={(phrase, replacement) => {
            setText(text.replace(phrase, replacement));
          }}
        />
      )}
    </div>
  );
}
```

### Highlighting Strategy
Instead of a fancy editor, use simple inline `<mark>` tags with CSS:

```html
<div class="text-view">
  This is a normal sentence. <mark class="cliche severity-9">In today's landscape</mark>,
  we must <mark class="cliche severity-8">unlock the potential</mark> of...
</div>
```

```css
mark.cliche {
  background-color: #fee2e2;
  color: #7f1d1d;
  padding: 2px 4px;
  border-radius: 3px;
  cursor: pointer;
}

mark.cliche:hover {
  background-color: #fca5a5;
}
```

---

## 10. ENVIRONMENT VARIABLES (`.env.example`)

```bash
# Server
NODE_ENV=development
PORT=3001
APP_URL=http://localhost:3000
API_URL=http://localhost:3001

# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic (for nuanced detection)
ANTHROPIC_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_MONTHLY=
STRIPE_PRICE_ID_YEARLY=

# Email
RESEND_API_KEY=

# Auth
JWT_SECRET=
MAGIC_LINK_EXPIRES_IN=15m

# Analytics
PLAUSIBLE_DOMAIN=

# Monitoring
SENTRY_DSN=
```

---

## 11. PHASED BUILD PLAN

### Phase 1 — Foundation (Day 1–2)
- [ ] Init monorepo (api + web + extension + shared)
- [ ] Set up Supabase, run migrations
- [ ] Init Express server with `/healthz`
- [ ] Init Next.js with Tailwind
- [ ] Load cliches.json, test fast detection on sample text

**Acceptance:** `pnpm dev` runs both apps. Fast detection returns clichés correctly on 10 test texts.

### Phase 2 — Core Detection & API (Day 3–5)
- [ ] Implement `clicheDetector.ts` with regex-based fast matching
- [ ] Wire up `POST /api/analyze` endpoint
- [ ] Implement health score calculation
- [ ] Add basic rate limiting by IP (30 analyses per hour per IP)
- [ ] Test with 100+ real text samples

**Acceptance:** Call `/api/analyze` with various texts, get back accurate clichés + health score within 500ms.

### Phase 3 — Web UI (Day 6–8)
- [ ] Build `/analyze` page with textarea + button
- [ ] Implement highlighting + sidebar stats
- [ ] Build suggestion modal
- [ ] Build "Auto-fix all" feature
- [ ] Add export/copy-to-clipboard

**Acceptance:** Paste a text with known clichés, UI highlights them, clicking a replacement works, score updates.

### Phase 4 — Auth & Accounts (Day 9–10)
- [ ] Magic link auth (email OTP via Resend)
- [ ] User creation on first login
- [ ] `/dashboard` with usage stats
- [ ] Free tier quota enforcement (5 analyses for anon, 50/month for free tier)
- [ ] JWT-protected `/analyze` endpoint

**Acceptance:** Sign up with email, get magic link, log in, see dashboard, usage counted correctly.

### Phase 5 — Stripe Billing (Day 11–12)
- [ ] Create Stripe products: Pro ($9/mo), Team ($29/mo)
- [ ] Stripe Checkout integration
- [ ] Webhook handlers for `subscription.created`, `subscription.deleted`, `invoice.payment_failed`
- [ ] Update user tier in DB based on Stripe status
- [ ] Add `/billing` page with Stripe customer portal link

**Acceptance:** Sign up free, hit quota, upgrade, charge succeeds, tier unlocked, usage limit increased.

### Phase 6 — Browser Extension (Day 13–14)
- [ ] Create Manifest V3 extension skeleton
- [ ] Content script to inject into textareas/contenteditable
- [ ] Background service worker to send requests to API
- [ ] Popup modal with analysis + suggestions
- [ ] Test on Gmail, LinkedIn, Medium, WordPress
- [ ] Submit to Chrome Web Store (requires Chrome developer account, $5)

**Acceptance:** Install extension, open Gmail compose, click extension icon, analyze email, get suggestions inline.

### Phase 7 — Marketing Site & Polish (Day 15)
- [ ] Landing page with hero, demo GIF, pricing, FAQ
- [ ] How-it-works page (5 steps)
- [ ] Pricing page with tier comparison
- [ ] Privacy policy + ToS
- [ ] OG images for social sharing
- [ ] Lighthouse score 90+

**Acceptance:** Landing page feels professional, conversion funnel clear.

### Phase 8 — Launch Prep (Day 16)
- [ ] Deploy API to Railway/Render
- [ ] Deploy web to Vercel
- [ ] DNS setup (domain → Vercel)
- [ ] Verify all webhooks (Stripe, Resend)
- [ ] End-to-end smoke test: signup → analyze → upgrade
- [ ] Set up uptime monitoring

**Acceptance:** Entire product works in production. No 500 errors in logs.

---

## 12. CLICHÉ DATABASE BUILD

### How to populate `cliches.json`

**Source 1: Manual curation (500 phrases)**
Go through your own writing, ChatGPT outputs, blog posts known to be AI-generated, and hand-write the 500 most recognizable ones. Categorize by domain.

**Source 2: Crowd-sourced (ongoing)**
After launch, users submit phrases that feel clichéd to them. Track in `/suggestions` endpoint, manually review + merge.

**Source 3: Research**
- Articles about "AI-written phrases" (there are many Medium posts on this)
- r/SubredditDrama threads mocking AI language
- HN comments about ChatGPT patterns
- Corpus analysis of known-AI content vs. human content

**Structure each entry:**
```json
{
  "id": "c123",
  "phrase": "exact phrase to match",
  "category": "business|tech|academic|marketing|other",
  "severity": 1-10,
  "matchType": "exact|word|phrase",
  "alternatives": ["alt1", "alt2", "alt3"],
  "explanation": "Why this sucks and what to do instead",
  "examples": ["Bad: ...", "Good: ..."]
}
```

Start with 200 phrases for launch. Add 50 every month.

---

## 13. EDGE CASES & ERROR HANDLING

| Scenario | Behavior |
|----------|----------|
| User submits 50,000-word novel | Truncate to 10,000, analyze, warn user |
| User is over quota | Reply with upgrade prompt + limited results |
| Cliché phrase appears 50 times in text | Count it once, show count in sidebar |
| User fixes a phrase manually, re-analyzes | Detect the fix, celebrate it |
| API key exposed in public repo | Log, notify user, suggest regenerate |
| Anthropic API is down | Fall back to fast detection silently |
| Magic link expires | Redirect to login, explain it expired |
| User has no subscription but hit Pro feature | Redirect to pricing, show benefit |

---

## 14. SECURITY CHECKLIST

- [ ] All form inputs sanitized (no script injection)
- [ ] JWT validation on all protected routes
- [ ] Rate limiting: 30 analyses per IP per hour (free users), unlimited for paid
- [ ] API keys are 32-char random strings, never logged
- [ ] Cliché patterns in JSON are public (fine) but user text is never logged
- [ ] HTTPS everywhere
- [ ] Stripe webhook signature validation
- [ ] Resend API key never in client-side code
- [ ] RLS policies on all user data
- [ ] CORS configured (API only accepts requests from your domain + extension)

---

## 15. TESTING REQUIREMENTS

### Unit tests (Vitest)
- `clicheDetector.ts` — 50+ test cases:
  - Exact match: "in today's landscape" in various casings
  - Word match: "cutting-edge" with hyphens
  - Phrase match: "it's crucial to" with variations
  - Count accuracy: "phrase" appears 3x, counted as 3
  - Edge cases: empty text, all-cliché text, no clichés
  - Performance: 5000-word text analyzed in < 1 second

- `phraseDb.ts` — can load JSON without corruption, duplicate detection

### Integration tests (API)
- `POST /api/analyze` with various texts
- Magic link flow: request → email send → verify → JWT
- Rate limiting: 31st request returns 429
- Quota enforcement: free tier hits limit, paid tier doesn't

### E2E tests (Playwright)
- Sign up → analyze → upgrade → use Pro feature
- Extension installed, inject into Gmail, analyze, suggest
- Save analysis to history, retrieve from dashboard

### Manual QA
- [ ] Paste 10 real texts (blog posts, emails, essays), verify clichés detected
- [ ] Fix a phrase manually, re-analyze, verify it's gone
- [ ] Extension works in 3+ browsers
- [ ] Mobile responsive (under 800px width)

---

## 16. GO-TO-MARKET PLAYBOOK

### Target personas
- **Freelance copywriters** (50%)
- **Content creators** (20%)
- **Academics** (15%)
- **B2B marketers** (10%)
- **Newsletter writers** (5%)

### Distribution channels (order of priority)
1. **Reddit:** r/copywriting, r/writing, r/content_creators, r/marketing — comment helpfully on threads about AI writing.
2. **Twitter/X:** Share before-after examples. Tag #WritingCommunity #ContentCreators.
3. **Indie Hackers:** Post launch story + metrics.
4. **Product Hunt:** Launch here, aim for 500+ upvotes on day 1.
5. **Substack:** Reach out to 50 popular newsletter writers, offer free Pro tier in exchange for 1 mention.
6. **YouTube:** "ChatGPT wrote my blog post, here's what I fixed" video (3–5 min).

### First 50 customers
- Free Pro tier for 3 months in exchange for Twitter testimonial
- Collect 5 video testimonials for landing page

### Pricing experiments
- Start at $9/month (undercut competitors)
- After 100 customers, test $12/month
- Annual discount: $100/year (vs $108/year monthly)

---

## 17. ANALYTICS / METRICS TO TRACK

### North-star metric
- **Monthly active users (MAU) with 5+ analyses per month**

### Funnel
- Visits → sign up
- Sign up → first analysis
- First analysis → upgrade to Pro
- Pro → monthly retention

### Product health
- Detection accuracy (% clichés caught on known test set)
- False positive rate (% of highlighted phrases user rejects)
- API latency (P95 < 500ms)
- Extension crash rate

### Business
- Monthly Recurring Revenue (MRR)
- Customer acquisition cost (CAC)
- Lifetime value (LTV)
- Churn rate

---

## 18. POST-LAUNCH ROADMAP (DO NOT BUILD UPFRONT)

After 500+ users:
- **Tone detection:** "Match my writing style" preference (formal, casual, technical)
- **Vocabulary suggestions:** Show synonyms ranked by frequency (common vs. rare)
- **Integration:** Zapier + Make.com for pipeline to tools like WordPress, Ghost, Substack
- **Team analytics:** Show team-wide cliché trends (what's the team over-using?)
- **Custom phrase lists:** Upload your own organization's forbidden phrases
- **AI writing detector:** "Is this likely AI-written?" (separate product)

---

## 19. README.md

```markdown
# Cliché Killer

Remove AI-generated phrases from your writing. Get a human voice back.

## Setup

\`\`\`bash
git clone ...
cd cliche-killer
pnpm install
pnpm db:migrate
pnpm dev
\`\`\`

Open http://localhost:3000/analyze.

## Tech

- **Backend:** Node.js + Express
- **Frontend:** Next.js 14 + Tailwind
- **Detection:** Pattern matching + Claude API
- **Auth:** Supabase (magic links)
- **Payments:** Stripe

## Testing

\`\`\`bash
pnpm test:unit    # Vitest
pnpm test:e2e     # Playwright
\`\`\`

## Deployment

- **API:** `git push` → Railway auto-deploys
- **Web:** `git push` → Vercel auto-deploys

## Updating the cliché database

Edit \`apps/api/data/cliches.json\` and redeploy.
```

---

## 20. AGENT INSTRUCTIONS (FOR CLAUDE CODE)

You are building this product end-to-end. Protocol:

1. **Start with Phase 1.** No jumping ahead.
2. **After each phase:** Run acceptance test, show me the result, wait for approval.
3. **Ask before:**
   - Using a third-party library not listed in §3
   - Adding any database field not in §6
   - Building any feature listed as "post-launch"
4. **Never:**
   - Commit secrets to git
   - Skip tests for `clicheDetector.ts`
   - Use anything other than Supabase for auth
   - Build an admin panel
5. **Always:**
   - TypeScript strict mode
   - Structured logging (pino)
   - Handle all errors with try/catch

**Default to simplicity.** Every feature you don't build is a feature shipped.

---

## 21. SUCCESS CRITERIA

The product is "done v1" when:
- [ ] A writer can paste a draft in < 5 seconds
- [ ] Clichés are detected with > 90% accuracy (test with 20 known clichéd texts)
- [ ] They can fix all clichés or export cleaned text in < 2 minutes
- [ ] They can upgrade and pay via Stripe
- [ ] Browser extension works on Chrome/Edge/Brave
- [ ] You have 50+ signups in first week
- [ ] You have 5+ paying customers by week 2
- [ ] 0 critical errors in production (Sentry)

Ship it. Get real feedback. Iterate.

---

**END OF PROMPT**
```