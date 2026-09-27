import { Link } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent-strong)]">
              <ShieldCheck size={16} strokeWidth={2.25} />
            </span>
            <span className="font-[var(--font-display)] text-sm font-semibold text-[var(--text)]">
              HireGuard.ai
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--text-muted)]">
            An academic mini project applying machine learning and TF-IDF text analysis to flag
            job advertisements that show signs of being fraudulent.
          </p>
          <p className="mt-4 text-xs text-[var(--text-faint)]">
            St Thomas Institute for Science and Technology &middot; Guide: Arya Dinachandran
          </p>
        </div>

        <div>
          <h3 className="field-label !mb-3 !text-[var(--text)]">Project</h3>
          <ul className="flex flex-col gap-2 text-sm text-[var(--text-muted)]">
            <li><Link to="/how-it-works" className="hover:text-[var(--accent-strong)]">How It Works</Link></li>
            <li><Link to="/dataset" className="hover:text-[var(--accent-strong)]">Dataset</Link></li>
            <li><Link to="/about" className="hover:text-[var(--accent-strong)]">About the Project</Link></li>
            <li><Link to="/dashboard" className="hover:text-[var(--accent-strong)]">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="field-label !mb-3 !text-[var(--text)]">Get Started</h3>
          <ul className="flex flex-col gap-2 text-sm text-[var(--text-muted)]">
            <li><Link to="/detect" className="hover:text-[var(--accent-strong)]">Check a Job Posting</Link></li>
            <li><Link to="/team" className="hover:text-[var(--accent-strong)]">Meet the Team</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-[var(--text-faint)] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} HireGuard. Built for academic demonstration purposes only.</p>
          <p>Predictions are model estimates, not a guarantee of legitimacy.</p>
        </div>
      </div>
    </footer>
  )
}
