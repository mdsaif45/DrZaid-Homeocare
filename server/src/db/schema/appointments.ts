import { pgTable, serial, integer, varchar, text, date, time, boolean, timestamp } from 'drizzle-orm/pg-core';
import { patients } from './patients.js';

export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  patient_id: integer('patient_id').references(() => patients.id, { onDelete: 'set null' }),
  patient_name: varchar('patient_name', { length: 255 }),
  patient_phone: varchar('patient_phone', { length: 50 }).notNull(),
  patient_email: varchar('patient_email', { length: 255 }),
  appointment_date: date('appointment_date').notNull(),
  appointment_time: time('appointment_time').notNull(),
  service_type: varchar('service_type', { length: 100 }),
  consultation_mode: varchar('consultation_mode', { length: 50 }).default('clinic'),
  status: varchar('status', { length: 50 }).default('pending'),
  notes: text('notes'),
  reminder_sent: boolean('reminder_sent').default(false),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type AppointmentSelect = typeof appointments.$inferSelect;
export type AppointmentInsert = typeof appointments.$inferInsert;
