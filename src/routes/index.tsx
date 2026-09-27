import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, ScanSearch, FileWarning, Database, LineChart, ShieldAlert, Fingerprint } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Home,
})

const FEATURES = [
  {
    icon: ScanSearch,
    title: 'TF-IDF Text Analysis',
    body: 'Job titles, descriptions, and requirements are vectorized so the model can weigh which words actually separate real listings from scams.',
  },
  {
    icon: Fingerprint,
    title: 'Fraud Signal Detection',
    body: 'Flags patterns common in scam listings — vague company profiles, upfront fees, and urgency-driven language.',
  },
  {
    icon: LineChart,
    title: 'Confidence Scoring',
    body: 'Every verdict ships with a confidence percentage and the specific signals that drove the prediction.',
  },
  {
    icon: Database,
    title: 'Prediction Dashboard',
    body: 'Every check is logged, so you can track how many postings were flagged genuine or fake over time.',
  },
]

const CONCERNS = [
  {
    title: 'Advance-fee scams',
    body: '"Pay a small onboarding or training fee before your first day" is one of the most common tactics fraudulent recruiters use.',
  },
  {
    title: 'Identity theft',
    body: 'Fake postings often exist purely to harvest resumes, bank details, or government ID numbers from applicants.',
  },
  {
    title: 'Wasted time and trust',
    body: 'Interview cycles for listings that never had a real role erode confidence in legitimate remote and entry-level postings.',
  },
]

function Home() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="pointer-events-none absolute inset-0 grid-noise opacity-40" />
        <div className="container-page relative grid gap-12 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-24">
          <div className="animate-fade-up">
            <span className="badge">
              <ShieldAlert size={13} /> ML-Based Fraud Screening
            </span>
            <h1 className="mt-5 font-[var(--font-display)] text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--text)] sm:text-5xl">
              Fake Job Posting Detection
            </h1>
            <p className="mt-4 max-w-lg text-lg font-medium text-[var(--accent-strong)]">
              Using Machine Learning to Identify Fraudulent Job Advertisements
            </p>
            <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-[var(--text-muted)]">
              Online recruitment fraud costs job seekers time, money, and personal data every year.
              Scammers copy the structure of real listings almost perfectly, which makes fake postings
              hard to spot by eye. This project trains a text-classification model on a labeled dataset
              of real and fraudulent listings, then exposes it through a simple form so anyone can paste
              a posting and get an instant read on its risk level.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/detect" className="btn btn-primary">
                Check a Job Posting <ArrowRight size={16} />
              </Link>
              <Link to="/how-it-works" className="btn btn-secondary">
                See How It Works
              </Link>
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:120ms]">
            <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] shadow-2xl shadow-black/40">
              <img
                src="/.netlify/images?url=/img/hero-shield.png&w=960&fm=webp&q=82"
                alt="Abstract illustration of a network-shaped shield analyzing documents"
                className="h-full w-full object-cover"
                width={960}
                height={407}
              />
              <div className="scan-line pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--accent)]/25 to-transparent" />
            </div>
            <div className="card absolute -bottom-6 left-4 right-4 flex items-center justify-between gap-4 p-4 sm:left-8 sm:right-8">
              <div>
                <p className="field-label !mb-1">Sample verdict</p>
                <p className="font-[var(--font-display)] text-sm font-semibold text-[var(--danger)]">FAKE JOB POSTING</p>
              </div>
              <div className="text-right">
                <p className="field-label !mb-1">Confidence</p>
                <p className="font-[var(--font-display)] text-lg font-semibold text-[var(--text)]">83.4%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section border-b border-[var(--border)]">
        <div className="container-page">
          <div className="max-w-2xl">
            <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--text)] sm:text-3xl">
              Why fake job postings matter
            </h2>
            <p className="mt-3 text-[var(--text-muted)]">
              Fraudulent recruiters exploit the same trust signals — logos, job titles, salary ranges —
              that make real postings credible. The consequences fall entirely on the applicant.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {CONCERNS.map((c, i) => (
              <div
                key={c.title}
                className="card card-hover animate-fade-up p-6"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <FileWarning size={20} className="text-[var(--danger)]" />
                <h3 className="mt-4 font-semibold text-[var(--text)]">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="max-w-2xl">
            <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--text)] sm:text-3xl">
              What the platform does
            </h2>
            <p className="mt-3 text-[var(--text-muted)]">
              A complete pipeline from raw posting text to a labeled, explainable verdict.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="card card-hover animate-fade-up flex gap-4 p-6"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent-strong)]">
                  <f.icon size={19} />
                </span>
                <div>
                  <h3 className="font-semibold text-[var(--text)]">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--bg-elevated)]">
        <div className="container-page section flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--text)]">
              Have a listing you're unsure about?
            </h2>
            <p className="mt-2 max-w-md text-[var(--text-muted)]">
              Paste the job title, description, and a few other details — get a verdict in seconds.
            </p>
          </div>
          <Link to="/detect" className="btn btn-primary shrink-0">
            Check a Job Posting <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
