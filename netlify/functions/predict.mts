import type { Config } from '@netlify/functions'
import { db } from '../../db/index.js'
import { predictions } from '../../db/schema.js'

interface RequestBody {
  jobTitle?: string
  jobDescription?: string
  companyProfile?: string
  requirements?: string
  benefits?: string
  employmentType?: string
  requiredExperience?: string
  requiredEducation?: string
  industry?: string
  jobFunction?: string
  location?: string
  salaryRange?: string
  department?: string
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

  const mlApiUrl = process.env.ML_API_URL

  if (!mlApiUrl) {
    console.error('ML_API_URL environment variable is not configured')

    return Response.json(
      {
        error: 'ML prediction service is not configured.',
      },
      { status: 500 }
    )
  }

  const mlPayload = {
    title: jobTitle,
    location: body.location?.trim() ?? '',
    department: body.department?.trim() ?? '',
    salary_range: body.salaryRange?.trim() ?? '',
    company_profile: body.companyProfile?.trim() ?? '',
    description: jobDescription,
    requirements: body.requirements?.trim() ?? '',
    benefits: body.benefits?.trim() ?? '',
    employment_type: body.employmentType?.trim() ?? '',
    required_experience: body.requiredExperience?.trim() ?? '',
    required_education: body.requiredEducation?.trim() ?? '',
    industry: body.industry?.trim() ?? '',
    function: body.jobFunction?.trim() ?? '',
  }

  let mlResult: {
    label: 'FAKE' | 'GENUINE'
    confidence: number
    model?: string
  }

  try {
    const response = await fetch(
      `${mlApiUrl.replace(/\/$/, '')}/predict`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mlPayload),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()

      console.error(
        'ML API returned an error:',
        response.status,
        errorText
      )

      return Response.json(
        {
          error:
            'The ML prediction service is currently unavailable.',
        },
        { status: 502 }
      )
    }

    mlResult = await response.json()

    if (
      mlResult.label !== 'FAKE' &&
      mlResult.label !== 'GENUINE'
    ) {
      throw new Error('Invalid label returned by ML API')
    }

    if (typeof mlResult.confidence !== 'number') {
      throw new Error('Invalid confidence returned by ML API')
    }
  } catch (error) {
    console.error(
      'Failed to contact ML prediction API:',
      error
    )

    return Response.json(
      {
        error:
          'Unable to contact the ML prediction service.',
      },
      { status: 502 }
    )
  }

  const label = mlResult.label
  const confidence = mlResult.confidence

  const indicators =
    label === 'FAKE'
      ? [
          'Machine learning model classified this posting as potentially fraudulent.',
        ]
      : [
          'Machine learning model classified this posting as likely genuine.',
        ]

  try {
    await db.insert(predictions).values({
      jobTitle,
      industry: body.industry?.trim() || null,
      location: body.location?.trim() || null,
      employmentType: body.employmentType?.trim() || null,
      prediction: label,
      confidence,
      indicators,
    })
  } catch (error) {
    console.error(
      'Failed to store prediction history:',
      error
    )
  }

  const explanation =
    label === 'FAKE'
      ? 'The trained machine learning model classified this posting as potentially fraudulent based on patterns learned from the training dataset.'
      : 'The trained machine learning model classified this posting as likely genuine based on patterns learned from the training dataset.'

  return Response.json({
    label,
    confidence,
    explanation,
    indicators,
    modelVersion: 'TF-IDF + Logistic Regression',
    disclaimer:
      'This is an automated prediction and is not guaranteed to be 100% accurate. Always verify job offers independently.',
  })
}

export const config: Config = {
  path: '/api/predict',
  method: 'POST',
}
