/**
 * PLACEHOLDER PREDICTION ENGINE
 * ------------------------------------------------------------------
 * This module stands in for a trained scikit-learn classifier (TF-IDF +
 * Logistic Regression / Random Forest / Naive Bayes) that has not been
 * connected yet. It scores a job posting with the same kind of surface
 * signals a fraud classifier would learn from text, so the rest of the
 * app (API contract, dashboard, history) works end-to-end today.
 *
 * To swap in the real model: train it in Python, export it with joblib,
 * serve it behind an endpoint (e.g. a small FastAPI/Flask service, or a
 * Netlify Function that shells out to a Python runtime), and replace the
 * body of `runHeuristicModel` with a call to that endpoint — keep the
 * same `PredictionResult` return shape so nothing else has to change.
 */

export interface JobPostingInput {
  jobTitle: string
  companyProfile?: string
  jobDescription: string
  requirements?: string
  benefits?: string
  employmentType?: string
  requiredExperience?: string
  industry?: string
  jobFunction?: string
  location?: string
  salaryRange?: string
}

export interface PredictionResult {
  label: 'GENUINE' | 'FAKE'
  confidence: number
  indicators: string[]
  modelVersion: string
}

const PAYMENT_PATTERNS = [
  /processing fee/i,
  /registration fee/i,
  /training fee/i,
  /send (?:us )?money/i,
  /wire transfer/i,
  /bank (?:details|account) (?:to|for)/i,
  /western union/i,
  /deposit.{0,20}before.{0,20}start/i,
]

const URGENCY_PATTERNS = [
  /no experience needed/i,
  /immediate(?:ly)? start/i,
  /urgent(?:ly)? hiring/i,
  /guaranteed income/i,
  /earn \$?\d+.{0,15}(?:day|week|hour)/i,
  /be your own boss/i,
  /unlimited earning/i,
  /no interview necessary/i,
  /work from home.{0,15}guaranteed/i,
]

const PERSONAL_EMAIL_PATTERN = /@(gmail|yahoo|hotmail|outlook)\.com/i
const VAGUE_REQUIREMENTS_PATTERN = /(no requirements|anyone can apply|no skills? (?:needed|required))/i

function countMatches(text: string, patterns: RegExp[]): number {
  return patterns.reduce((count, pattern) => (pattern.test(text) ? count + 1 : count), 0)
}

function capsRatio(text: string): number {
  const letters = text.replace(/[^A-Za-z]/g, '')
  if (letters.length < 20) return 0
  const upper = letters.replace(/[^A-Z]/g, '')
  return upper.length / letters.length
}

export function runHeuristicModel(input: JobPostingInput): PredictionResult {
  const indicators: string[] = []
  let score = 0

  const description = input.jobDescription ?? ''
  const combinedText = [
    input.jobDescription,
    input.companyProfile,
    input.requirements,
    input.benefits,
  ]
    .filter(Boolean)
    .join(' \n ')

  const companyProfile = (input.companyProfile ?? '').trim()
  if (companyProfile.length === 0) {
    score += 18
    indicators.push('No company profile was provided')
  } else if (companyProfile.length < 40) {
    score += 10
    indicators.push('Company profile is unusually short')
  }

  const paymentHits = countMatches(combinedText, PAYMENT_PATTERNS)
  if (paymentHits > 0) {
    score += 30
    indicators.push('Mentions upfront payments, fees, or wire transfers')
  }

  const urgencyHits = countMatches(combinedText, URGENCY_PATTERNS)
  if (urgencyHits > 0) {
    score += Math.min(urgencyHits, 3) * 8
    indicators.push('Uses urgency or "too good to be true" recruiting language')
  }

  if (!input.salaryRange || input.salaryRange.trim().length === 0) {
    score += 6
    indicators.push('No salary range was disclosed')
  }

  const requirements = (input.requirements ?? '').trim()
  if (requirements.length === 0) {
    score += 10
    indicators.push('No job requirements were listed')
  } else if (VAGUE_REQUIREMENTS_PATTERN.test(requirements)) {
    score += 10
    indicators.push('Requirements are vague ("anyone can apply")')
  }

  if (description.trim().length < 150) {
    score += 10
    indicators.push('Job description is very short on detail')
  }

  if (PERSONAL_EMAIL_PATTERN.test(combinedText)) {
    score += 12
    indicators.push('Asks applicants to contact a free personal email address')
  }

  const shoutiness = capsRatio(combinedText)
  if (shoutiness > 0.35) {
    score += 8
    indicators.push('Excessive use of capital letters')
  }

  if (!input.employmentType || input.employmentType.trim().length === 0) {
    score += 5
    indicators.push('Employment type was not specified')
  }

  const clamped = Math.max(2, Math.min(98, score))
  const isFake = clamped >= 50
  const confidence = isFake ? clamped : 100 - clamped

  return {
    label: isFake ? 'FAKE' : 'GENUINE',
    confidence: Math.round(confidence * 10) / 10,
    indicators: indicators.slice(0, 5),
    modelVersion: 'heuristic-placeholder-v1',
  }
}
