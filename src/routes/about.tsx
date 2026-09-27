import { createFileRoute } from '@tanstack/react-router'
import { Target, ListChecks, Sparkles, Layers, Info } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: About,
})

const OBJECTIVES = [
  'Automatically detect fake job postings using text classification',
  'Build a machine learning model trained on labeled recruitment data',
  'Reduce online recruitment fraud by flagging suspicious listings early',
  'Improve safety for job seekers evaluating unfamiliar postings',
  'Analyze which job posting features correlate most with fraud',
  'Achieve high prediction accuracy while keeping the model explainable',
]

const TECH = [
  { group: 'Data & Modeling', items: ['Python', 'pandas', 'scikit-learn', 'TF-IDF Vectorizer'] },
  { group: 'Candidate Classifiers', items: ['Logistic Regression', 'Random Forest', 'Naive Bayes'] },
  { group: 'Model Serving', items: ['Joblib model export', 'Flask / FastAPI (or serverless function)'] },
  { group: 'This Website', items: ['React', 'TanStack Start', 'Tailwind CSS', 'Netlify Functions', 'Postgres'] },
]

function About() {
  return (
    <div className="container-page section max-w-4xl">
      <div className="animate-fade-up">
        <span className="badge">
          <Info size={13} /> About the Project
        </span>
        <h1 className="mt-4 font-[var(--font-display)] text-3xl font-semibold text-[var(--text)] sm:text-4xl">
          Fake Job Posting Detection Using Machine Learning
        </h1>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="card animate-fade-up p-6">
          <Target size={20} className="text-[var(--accent-strong)]" />
          <h2 className="mt-3 font-semibold text-[var(--text)]">Problem Statement</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
            Fraudulent job postings on hiring platforms and social media cost applicants money, time,
            and personal data. They are difficult to distinguish from genuine listings by eye because
            scammers imitate the structure and tone of real postings. This project explores whether a
            text-classification model trained on posting content can reliably separate the two.
          </p>
        </div>

        <div className="card animate-fade-up p-6 [animation-delay:60ms]">
          <Sparkles size={20} className="text-[var(--accent-strong)]" />
          <h2 className="mt-3 font-semibold text-[var(--text)]">Expected Outcome</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
            A working classifier that labels a job posting as genuine or fake with an accompanying
            confidence score, deployed behind a simple web interface so the model can be demonstrated
            interactively rather than only evaluated offline in a notebook.
          </p>
        </div>
      </div>

      <div className="card animate-fade-up mt-5 p-6 [animation-delay:120ms]">
        <ListChecks size={20} className="text-[var(--accent-strong)]" />
        <h2 className="mt-3 font-semibold text-[var(--text)]">Objectives</h2>
        <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {OBJECTIVES.map((obj) => (
            <li key={obj} className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--text-muted)]">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
              {obj}
            </li>
          ))}
        </ul>
      </div>

      <div className="card animate-fade-up mt-5 p-6 [animation-delay:180ms]">
        <Layers size={20} className="text-[var(--accent-strong)]" />
        <h2 className="mt-3 font-semibold text-[var(--text)]">Technologies Used</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {TECH.map((group) => (
            <div key={group.group}>
              <p className="field-label">{group.group}</p>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 py-1 text-xs text-[var(--text-muted)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs leading-relaxed text-[var(--text-faint)]">
          The trained scikit-learn model has not been connected to this deployment yet. The Detect page
          currently calls a rule-based placeholder that mirrors the exact API contract the real model
          will use, so this front end needs no changes once the trained model is served behind
          <span className="mono"> /api/predict</span>.
        </p>
      </div>
    </div>
  )
}
