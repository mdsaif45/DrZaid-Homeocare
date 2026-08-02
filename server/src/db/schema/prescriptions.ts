import { pgTable, serial, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { caseRecords } from './caseRecords.js';
import { patients } from './patients.js';
import { users } from './users.js';

export const prescriptions = pgTable('prescriptions', {
  id: serial('id').primaryKey(),
  case_record_id: integer('case_record_id').references(() => caseRecords.id, { onDelete: 'set null' }),
  patient_id: integer('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  prescribed_by: integer('prescribed_by').references(() => users.id),
  remedy_name: varchar('remedy_name', { length: 255 }).notNull(),
  potency: varchar('potency', { length: 50 }),
  dosage: varchar('dosage', { length: 100 }),
  repetition: varchar('repetition', { length: 100 }),
  instructions: text('instructions'),
  prescription_date: timestamp('prescription_date', { withTimezone: true }).defaultNow(),
  follow_up_date: timestamp('follow_up_date', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type PrescriptionSelect = typeof prescriptions.$inferSelect;
export type PrescriptionInsert = typeof prescriptions.$inferInsert;
