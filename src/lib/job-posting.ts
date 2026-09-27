export interface JobPostingFormData {
  jobTitle: string
  companyProfile: string
  jobDescription: string
  requirements: string
  benefits: string
  employmentType: string
  requiredExperience: string
  industry: string
  jobFunction: string
  location: string
  salaryRange: string
}

export interface PredictionResponse {
  label: 'GENUINE' | 'FAKE'
  confidence: number
  explanation: string
  indicators: string[]
  modelVersion: string
  disclaimer: string
}

export const EMPTY_JOB_POSTING: JobPostingFormData = {
  jobTitle: '',
  companyProfile: '',
  jobDescription: '',
  requirements: '',
  benefits: '',
  employmentType: '',
  requiredExperience: '',
  industry: '',
  jobFunction: '',
  location: '',
  salaryRange: '',
}

export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Other']

export const EXPERIENCE_LEVELS = ['Not applicable', 'Internship', 'Entry level', 'Associate', 'Mid-Senior level', 'Director']

export async function submitJobPosting(data: JobPostingFormData): Promise<PredictionResponse> {
  const response = await fetch('/api/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'Unexpected server error' }))
    throw new Error(body.error ?? 'Unable to analyze this posting right now.')
  }

  return response.json()
}
