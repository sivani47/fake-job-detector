import { createFileRoute } from '@tanstack/react-router'
import { Database, FileSpreadsheet, Scale, ExternalLink } from 'lucide-react'

export const Route = createFileRoute('/dataset')({
  component: DatasetPage,
})

const COLUMNS = [
  'title', 'location', 'department', 'salary_range', 'company_profile',
  'description', 'requirements', 'benefits', 'telecommuting', 'has_company_logo',
  'has_questions', 'employment_type', 'required_experience', 'required_education',
  'industry', 'function', 'fraudulent',
]

function DatasetPage() {
  return (
    <div className="container-page section max-w-4xl">
      <div className="animate-fade-up">
        <span className="badge">
          <Database size={13} /> Training Data
        </span>
        <h1 className="mt-4 font-[var(--font-display)] text-3xl font-semibold text-[var(--text)] sm:text-4xl">
          The dataset behind the model
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--text-muted)]">
          The model is trained on the <strong className="text-[var(--text)]">Fake Job Posting Prediction</strong> dataset
          published on Kaggle, a widely used benchmark for recruitment fraud research.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        <div className="card p-5">
          <p className="field-label">Total postings</p>
          <p className="font-[var(--font-display)] text-2xl font-semibold text-[var(--text)]">~17,880</p>
          <p className="mt-1 text-xs text-[var(--text-faint)]">approximate, per source dataset</p>
        </div>
        <div className="card p-5">
          <p className="field-label">Labeled fraudulent</p>
          <p className="font-[var(--font-display)] text-2xl font-semibold text-[var(--danger)]">~5%</p>
          <p className="mt-1 text-xs text-[var(--text-faint)]">a realistic, imbalanced class split</p>
        </div>
        <div className="card p-5">
          <p className="field-label">Classification type</p>
          <p className="font-[var(--font-display)] text-2xl font-semibold text-[var(--text)]">Binary</p>
          <p className="mt-1 text-xs text-[var(--text-faint)]">genuine (0) vs. fraudulent (1)</p>
        </div>
      </div>

      <div className="card animate-fade-up mt-8 p-6">
        <div className="flex items-center gap-3">
          <FileSpreadsheet size={20} className="text-[var(--accent-strong)]" />
          <h2 className="font-semibold text-[var(--text)]">Fields captured per posting</h2>
        </div>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Each row mirrors the fields collected on the Detect page, plus a few structural signals used
          only during training.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {COLUMNS.map((col) => (
            <span key={col} className="mono rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 py-1 text-xs text-[var(--text-muted)]">
              {col}
            </span>
          ))}
        </div>
      </div>

      <div className="card animate-fade-up mt-5 flex items-start gap-4 p-6">
        <Scale size={20} className="mt-0.5 shrink-0 text-[var(--amber)]" />
        <div>
          <h2 className="font-semibold text-[var(--text)]">Class imbalance</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
            Genuine postings vastly outnumber fraudulent ones in the wild, which is why the dataset is
            itself imbalanced. Training accounts for this with stratified train/test splitting and by
            weighing precision and recall on the fraudulent class more heavily than raw accuracy — a
            model that always predicts "genuine" would score high on accuracy while catching zero scams.
          </p>
        </div>
      </div>

      <a
        href="https://www.kaggle.com/datasets/shivamb/real-or-fake-fake-jobposting-prediction"
        target="_blank"
        rel="noreferrer"
        className="btn btn-secondary mt-8"
      >
        View dataset on Kaggle <ExternalLink size={15} />
      </a>
    </div>
  )
}
