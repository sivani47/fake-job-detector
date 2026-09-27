import type { Config } from '@netlify/functions'
import { desc, eq, sql } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { predictions } from '../../db/schema.js'

export default async (req: Request) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const [{ total }] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(predictions)
    const [{ genuine }] = await db
      .select({ genuine: sql<number>`count(*)::int` })
      .from(predictions)
      .where(eq(predictions.prediction, 'GENUINE'))
    const [{ fake }] = await db
      .select({ fake: sql<number>`count(*)::int` })
      .from(predictions)
      .where(eq(predictions.prediction, 'FAKE'))

    const history = await db
      .select()
      .from(predictions)
      .orderBy(desc(predictions.createdAt))
      .limit(10)

    return Response.json({
      total,
      genuine,
      fake,
      history,
    })
  } catch (error) {
    console.error('Failed to load dashboard stats:', error)
    return Response.json(
      { total: 0, genuine: 0, fake: 0, history: [] },
      { status: 200 },
    )
  }
}

export const config: Config = {
  path: '/api/stats',
  method: 'GET',
}
