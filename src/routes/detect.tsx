import { useState, type FormEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  ScanSearch,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  TriangleAlert,
  RotateCcw,
} from 'lucide-react'
import {
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  EMPTY_JOB_POSTING,
  submitJobPosting,
  type JobPostingFormData,
  type PredictionResponse,
} from '@/lib/job-posting'

export const Route = createFileRoute('/detect')({
  component: DetectPage,
})

type FieldErrors = Partial<Record<keyof JobPostingFormData, string>>

function validate(data: JobPostingFormData): FieldErrors {
  const errors: FieldErrors = {}
  if (data.jobTitle.trim().length < 2) {
    errors.jobTitle = 'Enter the job title as it appears in the posting.'
  }
  if (data.jobDescription.trim().length < 20) {
    errors.jobDescription = 'Paste at least a couple of sentences from the job description.'
  }
  return errors
}

function DetectPage() {
  const [form, setForm] = useState<JobPostingFormData>(EMPTY_JOB_POSTING)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [result, setResult] = useState<PredictionResponse | null>(null)

  function update<K extends keyof JobPostingFormData>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setLoading(true)
    setApiError(null)
    try {
      const response = await submitJobPosting(form)
      setResult(response)
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setForm(EMPTY_JOB_POSTING)
    setErrors({})
    setApiError(null)
    setResult(null)
  }

  if (result) {
    return <ResultView result={result} onReset={reset} jobTitle={form.jobTitle} />
  }

  return (
    <div className="container-page section max-w-4xl">
      <div className="mb-10 animate-fade-up">
        <span className="badge">
          <ScanSearch size={13} /> Job Detection
        </span>
        <h1 className="mt-4 font-[var(--font-display)] text-3xl font-semibold text-[var(--text)] sm:text-4xl">
          Check a job posting
        </h1>
        <p className="mt-3 max-w-xl text-[var(--text-muted)]">
          Fill in as much of the posting as you have. The model works best with the full job
          description, but every field helps refine the verdict.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card animate-fade-up p-6 sm:p-8 [animation-delay:80ms]">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Job Title"
            required
            value={form.jobTitle}
            error={errors.jobTitle}
            placeholder="e.g. Remote Data Entry Specialist"
            onChange={(v) => update('jobTitle', v)}
          />
          <Field
            label="Location"
            value={form.location}
            placeholder="e.g. Bengaluru, India (Remote)"
            onChange={(v) => update('location', v)}
          />
          <SelectField
            label="Employment Type"
            value={form.employmentType}
            options={EMPLOYMENT_TYPES}
            onChange={(v) => update('employmentType', v)}
          />
          <SelectField
            label="Required Experience"
            value={form.requiredExperience}
            options={EXPERIENCE_LEVELS}
            onChange={(v) => update('requiredExperience', v)}
          />
          <Field
            label="Industry"
            value={form.industry}
            placeholder="e.g. Information Technology"
            onChange={(v) => update('industry', v)}
          />
          <Field
            label="Function"
            value={form.jobFunction}
            placeholder="e.g. Customer Service"
            onChange={(v) => update('jobFunction', v)}
          />
          <Field
            label="Salary Range"
            value={form.salaryRange}
            placeholder="e.g. $40,000 - $55,000 per year"
            onChange={(v) => update('salaryRange', v)}
          />
        </div>

        <div className="mt-5 grid gap-5">
          <TextAreaField
            label="Company Profile"
            value={form.companyProfile}
            placeholder="A short description of the company posting the job"
            onChange={(v) => update('companyProfile', v)}
          />
          <TextAreaField
            label="Job Description"
            required
            value={form.jobDescription}
            error={errors.jobDescription}
            placeholder="Paste the full job description here"
            rows={5}
            onChange={(v) => update('jobDescription', v)}
          />
          <TextAreaField
            label="Requirements"
            value={form.requirements}
            placeholder="Skills, qualifications, or experience requested"
            onChange={(v) => update('requirements', v)}
          />
          <TextAreaField
            label="Benefits"
            value={form.benefits}
            placeholder="Perks or benefits mentioned in the posting"
            onChange={(v) => update('benefits', v)}
          />
        </div>

        {apiError && (
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger-soft)] p-4 text-sm text-[var(--danger)]">
            <TriangleAlert size={17} className="mt-0.5 shrink-0" />
            <p>{apiError}</p>
          </div>
        )}

        <div className="mt-7 flex items-center gap-4">
          <button type="submit" disabled={loading} className="btn btn-primary min-w-[10rem] disabled:opacity-70">
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                <ScanSearch size={16} /> Detect Job
              </>
            )}
          </button>
          <p className="text-xs text-[var(--text-faint)]">
            Data is used only to generate this prediction and populate the demo dashboard.
          </p>
        </div>
      </form>
    </div>
  )
}

function ResultView({
  result,
  onReset,
  jobTitle,
}: {
  result: PredictionResponse
  onReset: () => void
  jobTitle: string
}) {
  const isFake = result.label === 'FAKE'
  return (
    <div className="container-page section max-w-3xl">
      <div className="card animate-fade-up overflow-hidden p-0">
        <div
          className="flex flex-col items-center gap-4 border-b border-[var(--border)] px-6 py-10 text-center sm:px-10"
          style={{ background: isFake ? 'var(--danger-soft)' : 'var(--accent-soft)' }}
        >
          <span
            className={`flex h-16 w-16 items-center justify-center rounded-full ${isFake ? 'pulse-ring' : ''}`}
            style={{
              background: isFake ? 'rgba(224,89,106,0.18)' : 'rgba(47,191,143,0.18)',
              color: isFake ? 'var(--danger)' : 'var(--accent-strong)',
            }}
          >
            {isFake ? <ShieldAlert size={30} /> : <ShieldCheck size={30} />}
          </span>
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">{jobTitle || 'This posting'}</p>
            <h1
              className="mt-1 font-[var(--font-display)] text-2xl font-bold sm:text-3xl"
              style={{ color: isFake ? 'var(--danger)' : 'var(--accent-strong)' }}
            >
              {isFake ? 'FAKE JOB POSTING' : 'GENUINE JOB POSTING'}
            </h1>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-[var(--text-muted)]">Model confidence</span>
              <span className="font-[var(--font-display)] font-semibold text-[var(--text)]">{result.confidence}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--bg-elevated)]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${result.confidence}%`,
                  background: isFake ? 'var(--danger)' : 'var(--accent)',
                }}
              />
            </div>
          </div>

          <p className="mt-6 leading-relaxed text-[var(--text)]">{result.explanation}</p>

          {result.indicators.length > 0 && (
            <div className="mt-6">
              <p className="field-label">Signals detected</p>
              <ul className="mt-2 flex flex-col gap-2">
                {result.indicators.map((indicator) => (
                  <li
                    key={indicator}
                    className="flex items-start gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3.5 py-2.5 text-sm text-[var(--text-muted)]"
                  >
                    <TriangleAlert size={14} className="mt-0.5 shrink-0 text-[var(--amber)]" />
                    {indicator}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-7 flex items-start gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4 text-xs leading-relaxed text-[var(--text-faint)]">
            <TriangleAlert size={14} className="mt-0.5 shrink-0" />
            {result.disclaimer}
          </div>

          <button onClick={onReset} className="btn btn-secondary mt-7">
            <RotateCcw size={15} /> Check another posting
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  error?: string
}) {
  return (
    <div>
      <label className="field-label">
        {label} {required && <span className="text-[var(--danger)]">*</span>}
      </label>
      <input
        className={`field-input ${error ? 'field-input-error' : ''}`}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="mt-1.5 text-xs text-[var(--danger)]">{error}</p>}
    </div>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
  rows = 3,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  error?: string
  rows?: number
}) {
  return (
    <div>
      <label className="field-label">
        {label} {required && <span className="text-[var(--danger)]">*</span>}
      </label>
      <textarea
        className={`field-input resize-y ${error ? 'field-input-error' : ''}`}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="mt-1.5 text-xs text-[var(--danger)]">{error}</p>}
    </div>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: readonly string[]
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <select className="field-input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}
