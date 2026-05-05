# Cliché Killer

Remove AI-generated phrases from your writing. Get a human voice back.

## Setup

```bash
git clone ...
cd cliche-killer
npm install
npm run dev
```

Open http://localhost:3000/analyze.

## Tech

- **Backend:** Node.js + Express
- **Frontend:** Next.js 14 + Tailwind
- **Detection:** Pattern matching + Claude API
- **Auth:** Supabase (magic links)
- **Payments:** Stripe

## Testing

```bash
npm run test --workspace=apps/api
npm run test --workspace=apps/web
```

## Deployment

- **API:** Railway/Render
- **Web:** Vercel
