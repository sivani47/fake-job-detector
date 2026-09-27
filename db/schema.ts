import { pgTable, serial, text, real, timestamp, jsonb } from 'drizzle-orm/pg-core'

export const predictions = pgTable('predictions', {
  id: serial().primaryKey(),
  jobTitle: text('job_title').notNull(),
  industry: text('industry'),
  location: text('location'),
  employmentType: text('employment_type'),
  prediction: text('prediction').notNull(),
  confidence: real('confidence').notNull(),
  indicators: jsonb('indicators').$type<string[]>().notNull().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
