import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ShieldCheck, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/detect', label: 'Detect' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/dataset', label: 'Dataset' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/about', label: 'About' },
  { to: '/team', label: 'Team' },
] as const

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent-strong)]">
            <ShieldCheck size={18} strokeWidth={2.25} />
          </span>
          <span className="font-[var(--font-display)] text-[0.95rem] font-semibold tracking-tight text-[var(--text)]">
            HireGuard<span className="text-[var(--accent-strong)]">.ai</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)] data-[status=active]:text-[var(--accent-strong)]"
              activeOptions={{ exact: link.to === '/' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link to="/detect" className="btn btn-primary">
            Check a Job Posting
          </Link>
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text)] lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-[var(--border)] bg-[var(--bg)] lg:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-md px-2 py-2.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] data-[status=active]:text-[var(--accent-strong)]"
                activeOptions={{ exact: link.to === '/' }}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/detect" className="btn btn-primary mt-2 justify-center" onClick={() => setOpen(false)}>
              Check a Job Posting
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
