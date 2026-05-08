# Project Knowledge: Cliché Killer

Remove AI-generated phrases from your writing. Get a human voice back.

## Quickstart

```bash
npm install          # Install all workspaces
npm run dev          # Run both API (port 3001) and Web (port 3000)
open http://localhost:3000/analyze
```

## Commands

| Workspace | Command | Notes |
|-----------|---------|-------|
| All | `npm run dev` | Runs all workspaces with dev servers |
| All | `npm run build` | Builds all workspaces |
| All | `npm run test` | Runs tests in all workspaces |
| API | `npm run dev --workspace=apps/api` | Runs Express server with tsx watch |
| Web | `npm run dev --workspace=apps/web` | Runs Next.js dev server |
| API tests | `npm run test --workspace=apps/api` | Uses Vitest |
| Web tests | `npm run test --workspace=apps/web` | Uses Vitest |

## Architecture

### Key Directories

```
apps/
├── api/                 # Express API server (TypeScript, ESM)
│   └── src/
│       ├── server.ts    # Main entry point
│       ├── db/          # Supabase client
│       ├── routes/      # Express routers (analyze, auth, billing, webhooks)
│       ├── middleware/  # Auth & rate limiting
│       └── services/    # Business logic (clicheDetector, stripeService, etc.)
├── web/                 # Next.js frontend (React 19, TypeScript)
│   └── src/
│       ├── app/         # Next.js App Router pages
│       ├── components/  # React components
│       └── lib/         # API client & utilities
└── extension/           # Chrome extension (manifest v3)
    ├── popup.html/js    # Extension popup UI
    ├── content.js       # Content script for text detection
    └── background.js    # Service worker

packages/
└── shared/              # Shared types/utilities
```

### Data Flow

1. User submits text via **Web UI** (Next.js) or **API** directly
2. **Two-tier detection**: Fast pattern matching → Claude API (Pro only)
3. Results stored in **Supabase** (users, analyses, api_keys tables)
4. Pro users billed via **Stripe** (webhook handling in `/api/stripe/webhook`)

## Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| API Server | Node.js + Express 5 | TypeScript, ESM modules |
| Frontend | Next.js 16 + React 19 | App Router, Tailwind CSS v4 |
| Database | Supabase (Postgres) | Auth, users, api_keys tables |
| Auth | JWT + Magic Links | Supabase email auth |
| Payments | Stripe | Checkout & portal sessions |
| NLP | Pattern matching + Claude API | Tier 1: JSON phrase db, Tier 2: Anthropic |
| Extension | Chrome Extension v3 | Manifest v3, JS/CSS |

## Conventions

### TypeScript Configuration

- **API**: `module: NodeNext`, `moduleResolution: NodeNext` (ESM)
- **Web**: `moduleResolution: bundler` (Next.js handles this)
- Both use `strict: true`

### Code Patterns

- Import extensions: `*.js` for TypeScript (ESM requirement)
- Shared Supabase client: `apps/api/src/db/client.ts` (singleton)
- Auth middleware: `apps/api/src/middleware/auth.ts` (JWT + API key support)
- Rate limiting: IP-based via `apps/api/src/middleware/rateLimit.ts`

### API Endpoints

**Public:**
- `POST /api/analyze` — Analyze text (rate limited)
- `POST /api/auth/request-magic-link` — Send magic link
- `GET /api/auth/verify?token=...` — Verify magic link

**Authenticated (JWT):**
- `GET /api/auth/me` — Current user profile
- `POST /api/billing/checkout` — Create Stripe checkout
- `POST /api/billing/portal` — Create Stripe portal session

**Webhook:**
- `POST /api/webhooks` — Stripe subscription events

## Environment Variables

### API (.env)

```env
SUPABASE_URL=           # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=  # Service role key for server-side
JWT_SECRET=             # Secret for JWT signing
STRIPE_SECRET_KEY=      # Stripe API key
STRIPE_WEBHOOK_SECRET=  # Stripe webhook signing secret
RESEND_API_KEY=         # Email sending (magic links)
APP_URL=http://localhost:3000  # Frontend URL for redirects
PORT=3001               # API server port
```

## Gotchas

1. **ESM Imports**: Always use `.js` extension for local imports in API (TypeScript compiles to ESM)
2. **Stripe Webhook**: Must use `express.raw()` parser — cannot use JSON middleware before it
3. **Supabase Client**: Use the exported singleton from `db/client.ts`, don't create multiple instances
4. **Text Limit**: API truncates to 10,000 words for analysis
5. **Pro Tier**: Claude nuanced detection only for Pro users with text under 2,000 characters
6. **Rate Limit**: Applied via `rateLimit` middleware on `/api/analyze`