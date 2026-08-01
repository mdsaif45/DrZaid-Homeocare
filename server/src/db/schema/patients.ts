import { pgTable, serial, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const patients = pgTable('patients', {
  id: serial('id').primaryKey(),
  case_id: varchar('case_id', { length: 50 }).notNull().unique(),
  full_name: varchar('full_name', { length: 255 }).notNull(),
  age: integer('age'),
  gender: varchar('gender', { length: 20 }),
  contact_phone: varchar('contact_phone', { length: 50 }).notNull(),
  contact_email: varchar('contact_email', { length: 255 }),
  occupation: varchar('occupation', { length: 255 }),
  address: text('address'),
  lifestyle_habits: text('lifestyle_habits'),
  emergency_contact: varchar('emergency_contact', { length: 255 }),
  emergency_phone: varchar('emergency_phone', { length: 50 }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type PatientSelect = typeof patients.$inferSelect;
export type PatientInsert = typeof patients.$inferInsert;
