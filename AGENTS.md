# AGENTS.md

This document orients AI agents and developers working on this codebase.

## Project Overview

**HireGuard** — a college mini project titled "Fake Job Posting Detection Using Machine Learning." Visitors
paste a job advertisement into a form and receive a GENUINE/FAKE verdict with a confidence score. The site
also documents the ML methodology, the training dataset, and logs every prediction to a live dashboard.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1, Tailwind CSS 4 |
| Backend API | Netlify Functions (`netlify/functions/*.mts`) |
| Persistence | Netlify Database (Postgres) via Drizzle ORM |
| Build | Vite 7 |
| Deployment | Netlify |

## Directory Structure

```
├── db/
│   ├── schema.ts               # Drizzle schema: `predictions` table
│   └── index.ts                # Drizzle client (Netlify Database adapter)
├── drizzle.config.ts           # Points drizzle-kit at netlify/database/migrations
├── netlify/
│   ├── database/migrations/    # Auto-applied SQL migrations — never hand-edit after they land
│   └── functions/
│       ├── predict.mts         # POST /api/predict — scores a posting, logs it, returns a verdict
│       ├── stats.mts           # GET /api/stats — dashboard totals + recent prediction history
│       └── lib/heuristic-model.ts  # Placeholder prediction engine (see below)
├── public/img/hero-shield.png  # Generated hero illustration, served via Netlify Image CDN
├── src/
│   ├── components/Header.tsx, Footer.tsx
│   ├── lib/job-posting.ts      # Shared form types + `submitJobPosting()` client helper
│   └── routes/
│       ├── __root.tsx          # Root layout: fonts, Header, Footer
│       ├── index.tsx           # Home
│       ├── detect.tsx          # Job Detection form + result view
│       ├── how-it-works.tsx    # ML pipeline walkthrough
│       ├── about.tsx           # Problem statement, objectives, tech stack
│       ├── dataset.tsx         # Kaggle dataset description
│       ├── dashboard.tsx       # Live prediction stats + history table
│       └── team.tsx            # Team & guide credits
└── netlify.toml
```

## The Placeholder Prediction Engine

`netlify/functions/lib/heuristic-model.ts` implements a **rule-based stand-in** for the trained scikit-learn
classifier described on the About/How It Works pages. It scores postings on surface signals (missing
company profile, upfront-fee language, urgency phrasing, vague requirements, etc.) and returns the same
shape a real model would: `{ label, confidence, indicators, modelVersion }`.

To connect a real trained model: train it in Python (TF-IDF + Logistic Regression / Random Forest / Naive
Bayes), export it with `joblib`, serve it behind an HTTP endpoint, and replace the body of
`runHeuristicModel` (or the call site in `predict.mts`) with a request to that endpoint. No frontend changes
are needed as long as the response shape is preserved.

## Database

The `predictions` table (see `db/schema.ts`) logs every Detect-page submission: job title, industry,
location, employment type, verdict, confidence, and the triggered indicators. The Dashboard page reads
aggregate counts and recent history from `GET /api/stats`. Any schema change requires a new migration via
`npx drizzle-kit generate --name <description>` — see the `netlify-database` skill.

## Conventions

- Routes: TanStack Start file-based routing under `src/routes/`, kebab-case filenames.
- Styling: Tailwind utility classes plus a small set of custom component classes (`.card`, `.btn-primary`,
  `.field-input`, `.badge-*`) defined as CSS variables/utilities in `src/styles.css`. Keep new UI consistent
  with those tokens rather than introducing one-off colors.
- Fonts: IBM Plex Mono (display/headings) + IBM Plex Sans (body), loaded in `__root.tsx`.
- TypeScript strict mode; `@/*` path alias resolves to `src/*`.

## Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
```

Use `netlify dev --port 8889` instead of `npm run dev` when you need working Netlify Functions and Netlify
Database emulation locally.
