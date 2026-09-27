# HireGuard — Fake Job Posting Detection

A machine learning powered platform that analyzes job advertisements and flags characteristics commonly
associated with fraudulent listings. Built as a college mini project.

## What's here

- **Home** — project introduction and call to action.
- **Detect** (`/detect`) — paste a job posting's details and get a GENUINE/FAKE verdict with a confidence
  score, explanation, and the specific signals that drove the result.
- **How It Works** (`/how-it-works`) — the ML pipeline behind the detector, from dataset collection through
  TF-IDF feature extraction to classification.
- **About** (`/about`) — problem statement, objectives, expected outcome, and technologies used.
- **Dataset** (`/dataset`) — background on the Kaggle Fake Job Posting Prediction dataset.
- **Dashboard** (`/dashboard`) — live totals, genuine/fake split, and recent prediction history.
- **Team** (`/team`) — project team and guide.

## Tech stack

TanStack Start (React 19 + TanStack Router + Vite), Tailwind CSS 4, Netlify Functions, and Netlify Database
(Postgres via Drizzle ORM).

## The prediction model

`/api/predict` currently runs a rule-based heuristic (`netlify/functions/lib/heuristic-model.ts`) that
scores postings on known fraud signals — missing company profile, upfront-fee language, urgency phrasing,
vague requirements, and similar patterns. It returns the same response shape a trained model would
(`label`, `confidence`, `indicators`, `modelVersion`), so it's a drop-in placeholder: swap it for a real
TF-IDF + Logistic Regression / Random Forest / Naive Bayes classifier without touching the frontend. See
`AGENTS.md` for details on where to wire that in.

## Running locally

```bash
npm install
netlify dev --port 8889
```

`netlify dev` is required (rather than `npm run dev`) so that `/api/predict` and `/api/stats` and the
Netlify Database connection work locally.

## Data & privacy

Submitted job posting text is stored only to power the Dashboard's history and aggregate counts. No
external API keys are required to run predictions — the placeholder model runs entirely in the function.
