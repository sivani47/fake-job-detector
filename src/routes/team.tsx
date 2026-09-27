import { createFileRoute } from '@tanstack/react-router'
import { GraduationCap, Users } from 'lucide-react'

export const Route = createFileRoute('/team')({
  component: TeamPage,
})

const TEAM = [
  { name: 'Anjana Xavier', initials: 'AX' },
  { name: 'Arshad Muhammad S M', initials: 'AM' },
  { name: 'Athiradev V', initials: 'AV' },
  { name: 'Sivani S Nath', initials: 'SN' },
]

function TeamPage() {
  return (
    <div className="container-page section max-w-4xl">
      <div className="animate-fade-up">
        <span className="badge">
          <Users size={13} /> The Team
        </span>
        <h1 className="mt-4 font-[var(--font-display)] text-3xl font-semibold text-[var(--text)] sm:text-4xl">
          Built by
        </h1>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {TEAM.map((member, i) => (
          <div
            key={member.name}
            className="card card-hover animate-fade-up flex items-center gap-4 p-5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] font-[var(--font-display)] text-sm font-semibold text-[var(--accent-strong)]">
              {member.initials}
            </span>
            <div>
              <p className="font-semibold text-[var(--text)]">{member.name}</p>
              <p className="text-sm text-[var(--text-muted)]">Team Member</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card animate-fade-up mt-6 flex items-center gap-4 p-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--amber-soft)] text-[var(--amber)]">
          <GraduationCap size={20} />
        </span>
        <div>
          <p className="font-semibold text-[var(--text)]">Arya Dinachandran</p>
          <p className="text-sm text-[var(--text-muted)]">Project Guide</p>
        </div>
      </div>

      <p className="mt-10 text-sm text-[var(--text-muted)]">
        St Thomas Institute for Science and Technology
      </p>
    </div>
  )
}
