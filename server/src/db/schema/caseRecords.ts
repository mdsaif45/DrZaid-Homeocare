import { pgTable, serial, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { patients } from './patients.js';
import { users } from './users.js';

export const caseRecords = pgTable('case_records', {
  id: serial('id').primaryKey(),
  patient_id: integer('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  consultation_date: timestamp('consultation_date', { withTimezone: true }).defaultNow(),

  chief_complaints: text('chief_complaints'),
  complaint_tags: text('complaint_tags').array(),
  complaint_duration: varchar('complaint_duration', { length: 100 }),

  past_history: text('past_history'),
  family_history: text('family_history'),
  surgical_history: text('surgical_history'),

  general_examination: text('general_examination'),
  mental_state_examination: text('mental_state_examination'),

  clinical_notes: text('clinical_notes'),
  diagnosis: text('diagnosis'),
  treatment_plan: text('treatment_plan'),

  follow_up_notes: text('follow_up_notes'),
  next_follow_up_date: timestamp('next_follow_up_date', { withTimezone: true }),

  created_by: integer('created_by').references(() => users.id),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type CaseRecordSelect = typeof caseRecords.$inferSelect;
export type CaseRecordInsert = typeof caseRecords.$inferInsert;
