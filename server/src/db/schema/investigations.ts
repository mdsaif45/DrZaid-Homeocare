import { pgTable, serial, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { caseRecords } from './caseRecords.js';

export const investigations = pgTable('investigations', {
  id: serial('id').primaryKey(),
  case_record_id: integer('case_record_id').notNull().references(() => caseRecords.id, { onDelete: 'cascade' }),
  investigation_type: varchar('investigation_type', { length: 100 }),
  investigation_name: varchar('investigation_name', { length: 255 }),
  notes: text('notes'),
  findings: text('findings'),
  file_url: text('file_url'),
  file_name: varchar('file_name', { length: 255 }),
  file_type: varchar('file_type', { length: 50 }),
  file_size: integer('file_size'),
  investigation_date: timestamp('investigation_date', { withTimezone: true }),
  uploaded_at: timestamp('uploaded_at', { withTimezone: true }).defaultNow(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type InvestigationSelect = typeof investigations.$inferSelect;
export type InvestigationInsert = typeof investigations.$inferInsert;
