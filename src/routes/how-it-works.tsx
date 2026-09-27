import { createFileRoute } from '@tanstack/react-router'
import {
  Database,
  Eraser,
  SlidersHorizontal,
  Hash,
  SplitSquareHorizontal,
  Cpu,
  LineChart,
  ShieldCheck,
  Workflow,
} from 'lucide-react'

export const Route = createFileRoute('/how-it-works')({
  component: HowItWorks,
})

const STEPS = [
  {
    icon: Database,
    title: 'Dataset Collection',
    body: 'Thousands of labeled job postings — genuine and fraudulent — are gathered as the training corpus.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Data Preprocessing',
    body: 'Text fields are lowercased, tokenized, and stripped of HTML artifacts left over from the original postings.',
  },
  {
    icon: Eraser,
    title: 'Data Cleaning',
    body: 'Duplicate listings, empty fields, and irrelevant characters are removed so noise does not skew training.',
  },
  {
    icon: Hash,
    title: 'TF-IDF Feature Extraction',
    body: 'Cleaned text is converted into TF-IDF vectors, weighting words by how distinctive they are to fake vs. genuine listings.',
  },
  {
    icon: SplitSquareHorizontal,
    title: 'Train/Test Split',
    body: 'The labeled dataset is divided so the model can be evaluated on postings it has never seen.',
  },
  {
    icon: Cpu,
    title: 'ML Model Training',
    body: 'A classifier — Logistic Regression, Random Forest, or Naive Bayes — learns the boundary between the two classes.',
  },
  {
    icon: LineChart,
    title: 'Evaluation & Prediction',
    body: 'Accuracy, precision, and recall are measured on the test split before the model is trusted with new postings.',
  },
  {
    icon: ShieldCheck,
    title: 'Fake / Genuine Classification',
    body: 'The trained model scores a new posting and returns a label with a confidence percentage.',
  },
]

function HowItWorks() {
  return (
    <div className="container-page section max-w-4xl">
      <div className="animate-fade-up">
        <span className="badge">
          <Workflow size={13} /> Methodology
        </span>
        <h1 className="mt-4 font-[var(--font-display)] text-3xl font-semibold text-[var(--text)] sm:text-4xl">
          How the detection pipeline works
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--text-muted)]">
          The project follows a standard supervised text-classification workflow — from raw postings
          to a labeled verdict — built around TF-IDF vectorization and a compact set of classical ML
          classifiers well suited to structured, moderate-sized text datasets.
        </p>
      </div>

      <ol className="mt-12 flex flex-col">
        {STEPS.map((step, i) => (
          <li key={step.title} className="relative flex gap-5 pb-10 last:pb-0">
            {i < STEPS.length - 1 && (
              <span className="absolute left-[1.4rem] top-11 h-full w-px bg-[var(--border)]" aria-hidden />
            )}
            <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--accent-strong)]">
              <step.icon size={18} />
            </span>
            <div
              className="card card-hover animate-fade-up flex-1 p-5"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <p className="font-[var(--font-display)] text-xs font-semibold text-[var(--text-faint)]">
                Step {i + 1}
              </p>
              <h2 className="mt-1 font-semibold text-[var(--text)]">{step.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="card mt-4 p-6">
        <h2 className="font-semibold text-[var(--text)]">Candidate models</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
          Three classical classifiers are commonly compared for this task, each trading off differently
          between interpretability and raw accuracy on TF-IDF features:
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { name: 'Logistic Regression', note: 'Fast baseline, coefficients map directly to word importance.' },
            { name: 'Random Forest', note: 'Handles non-linear feature interactions, resistant to overfitting.' },
            { name: 'Naive Bayes', note: 'Well suited to sparse TF-IDF vectors and short text.' },
          ].map((m) => (
            <div key={m.name} className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
              <p className="text-sm font-semibold text-[var(--text)]">{m.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">{m.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-[var(--text-faint)]">
          The live demo on this site currently runs a transparent, rule-based scorer as a placeholder —
          see the <span className="mono">/api/predict</span> function — so the full product experience
          works before the trained model is deployed behind the same API contract.
        </p>
      </div>
    </div>
  )
}
