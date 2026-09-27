import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { BarChart3, ShieldCheck, ShieldAlert, Gauge, History, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

interface HistoryItem {
  id: number
  jobTitle: string
  industry: string | null
  location: string | null
  employmentType: string | null
  prediction: 'GENUINE' | 'FAKE'
  confidence: number
  indicators: string[]
  createdAt: string
}

interface StatsResponse {
  total: number
  genuine: number
  fake: number
  history: HistoryItem[]
}

const MODEL_ACCURACY_PLACEHOLDER = null as number | null

function Dashboard() {
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setStats(data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load dashboard data right now.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const total = stats?.total ?? 0
  const genuine = stats?.genuine ?? 0
  const fake = stats?.fake ?? 0
  const genuinePct = total > 0 ? Math.round((genuine / total) * 100) : 0
  const fakePct = total > 0 ? 100 - genuinePct : 0

  return (
    <div className="container-page section max-w-5xl">
      <div className="animate-fade-up">
        <span className="badge">
          <BarChart3 size={13} /> Live Dashboard
        </span>
        <h1 className="mt-4 font-[var(--font-display)] text-3xl font-semibold text-[var(--text)] sm:text-4xl">
          Prediction dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--text-muted)]">
          Every check submitted through the Detect page is logged here, giving a running view of how
          the model has been used.
        </p>
      </div>

      {error && <p className="mt-6 text-sm text-[var(--danger)]">{error}</p>}

      {!stats && !error && (
        <div className="mt-10 flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Loader2 size={16} className="animate-spin" /> Loading dashboard data...
        </div>
      )}

      {stats && (
        <>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={BarChart3} label="Total predictions" value={total.toLocaleString()} />
            <StatCard icon={ShieldCheck} label="Genuine detected" value={genuine.toLocaleString()} tone="accent" />
            <StatCard icon={ShieldAlert} label="Fake detected" value={fake.toLocaleString()} tone="danger" />
            <StatCard
              icon={Gauge}
              label="Model accuracy"
              value={MODEL_ACCURACY_PLACEHOLDER === null ? '—' : `${MODEL_ACCURACY_PLACEHOLDER}%`}
              hint="Populated once the trained model reports validation accuracy"
            />
          </div>

          <div className="card animate-fade-up mt-6 p-6">
            <p className="field-label">Genuine vs. fake split</p>
            {total === 0 ? (
              <p className="mt-3 text-sm text-[var(--text-muted)]">
                No predictions logged yet — results will appear here once postings are checked.
              </p>
            ) : (
              <>
                <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                  <div style={{ width: `${genuinePct}%`, background: 'var(--accent)' }} />
                  <div style={{ width: `${fakePct}%`, background: 'var(--danger)' }} />
                </div>
                <div className="mt-3 flex justify-between text-xs text-[var(--text-muted)]">
                  <span>Genuine {genuinePct}%</span>
                  <span>Fake {fakePct}%</span>
                </div>
              </>
            )}
          </div>

          <div className="card animate-fade-up mt-6 p-6">
            <div className="flex items-center gap-2.5">
              <History size={18} className="text-[var(--accent-strong)]" />
              <h2 className="font-semibold text-[var(--text)]">Recent predictions</h2>
            </div>
            {stats.history.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--text-muted)]">
                Nothing checked yet. Head to the Detect page to run the first prediction.
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wide text-[var(--text-faint)]">
                      <th className="pb-2.5 pr-4 font-medium">Job title</th>
                      <th className="pb-2.5 pr-4 font-medium">Verdict</th>
                      <th className="pb-2.5 pr-4 font-medium">Confidence</th>
                      <th className="pb-2.5 font-medium">Checked</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.history.map((row) => (
                      <tr key={row.id} className="border-b border-[var(--border)] last:border-0">
                        <td className="py-2.5 pr-4 text-[var(--text)]">{row.jobTitle}</td>
                        <td className="py-2.5 pr-4">
                          <span className={row.prediction === 'FAKE' ? 'badge badge-fake' : 'badge badge-genuine'}>
                            {row.prediction}
                          </span>
                        </td>
                        <td className="py-2.5 pr-4 font-[var(--font-display)] text-[var(--text)]">
                          {row.confidence}%
                        </td>
                        <td className="py-2.5 text-[var(--text-faint)]">
                          {new Date(row.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
  hint,
}: {
  icon: typeof BarChart3
  label: string
  value: string
  tone?: 'accent' | 'danger'
  hint?: string
}) {
  const color = tone === 'accent' ? 'var(--accent-strong)' : tone === 'danger' ? 'var(--danger)' : 'var(--text)'
  return (
    <div className="card p-5">
      <Icon size={18} style={{ color: tone ? color : 'var(--text-muted)' }} />
      <p className="field-label !mt-3">{label}</p>
      <p className="font-[var(--font-display)] text-2xl font-semibold" style={{ color }}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs leading-snug text-[var(--text-faint)]">{hint}</p>}
    </div>
  )
}
