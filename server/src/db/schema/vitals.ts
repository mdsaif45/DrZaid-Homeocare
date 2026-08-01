import { pgTable, serial, integer, numeric, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { caseRecords } from './caseRecords.js';

export const vitals = pgTable('vitals', {
  id: serial('id').primaryKey(),
  case_record_id: integer('case_record_id').notNull().references(() => caseRecords.id, { onDelete: 'cascade' }),
  blood_pressure_systolic: integer('blood_pressure_systolic'),
  blood_pressure_diastolic: integer('blood_pressure_diastolic'),
  pulse_rate: integer('pulse_rate'),
  respiratory_rate: integer('respiratory_rate'),
  temperature: numeric('temperature', { precision: 4, scale: 1 }),
  temperature_unit: varchar('temperature_unit', { length: 1 }).default('F'),
  oxygen_saturation: numeric('oxygen_saturation', { precision: 4, scale: 1 }),
  height: numeric('height', { precision: 5, scale: 2 }),
  weight: numeric('weight', { precision: 5, scale: 2 }),
  bmi: numeric('bmi', { precision: 4, scale: 1 }),
  notes: text('notes'),
  recorded_at: timestamp('recorded_at', { withTimezone: true }).defaultNow(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type VitalsSelect = typeof vitals.$inferSelect;
export type VitalsInsert = typeof vitals.$inferInsert;
