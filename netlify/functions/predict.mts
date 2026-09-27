import type { Config } from '@netlify/functions'
import { db } from '../../db/index.js'
import { predictions } from '../../db/schema.js'
import { runHeuristicModel, type JobPostingInput } from './lib/heuristic-model.ts'

interface RequestBody extends Partial<JobPostingInput> {
  jobTitle?: string
  jobDescription?: string
}

function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 })
}

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let body: RequestBody
  try {
    body = await req.json()
  } catch {
    return badRequest('Request body must be valid JSON')
  }

  const jobTitle = (body.jobTitle ?? '').trim()
  const jobDescription = (body.jobDescription ?? '').trim()

  if (jobTitle.length < 2) {
    return badRequest('Job title is required')
  }
  if (jobDescription.length < 20) {
    return badRequest('Job description must be at least 20 characters')
  }

  const input: JobPostingInput = {
    jobTitle,
    jobDescription,
    companyProfile: body.companyProfile?.trim(),
    requirements: body.requirements?.trim(),
    benefits: body.benefits?.trim(),
    employmentType: body.employmentType?.trim(),
    requiredExperience: body.requiredExperience?.trim(),
    industry: body.industry?.trim(),
    jobFunction: body.jobFunction?.trim(),
    location: body.location?.trim(),
    salaryRange: body.salaryRange?.trim(),
  }

  const result = runHeuristicModel(input)

  try {
    await db.insert(predictions).values({
      jobTitle: input.jobTitle,
      industry: input.industry || null,
      location: input.location || null,
      employmentType: input.employmentType || null,
      prediction: result.label,
      confidence: result.confidence,
      indicators: result.indicators,
    })
  } catch (error) {
    console.error('Failed to store prediction history:', error)
  }

  const explanation =
    result.label === 'FAKE'
      ? 'This posting contains characteristics commonly associated with fraudulent listings.'
      : 'This posting matches patterns commonly seen in legitimate job listings.'

  return Response.json({
    label: result.label,
    confidence: result.confidence,
    explanation,
    indicators: result.indicators,
    modelVersion: result.modelVersion,
    disclaimer: 'This is an automated prediction and is not guaranteed to be 100% accurate. Always verify job offers independently.',
  })
}

export const config: Config = {
  path: '/api/predict',
  method: 'POST',
}
