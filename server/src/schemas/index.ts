import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().optional(),
  role: z.enum(['doctor', 'admin']).optional().default('doctor'),
});

// Patient Schemas
export const createPatientSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  age: z.number().int().positive().optional(),
  gender: z.string().optional(),
  contact_phone: z.string().min(5, 'Contact phone is required'),
  contact_email: z.string().email().optional().or(z.literal('')),
  occupation: z.string().optional(),
  address: z.string().optional(),
  lifestyle_habits: z.string().optional(),
  emergency_contact: z.string().optional(),
  emergency_phone: z.string().optional(),
});

export const updatePatientSchema = createPatientSchema.partial();

// Case Record Schemas
export const createCaseRecordSchema = z.object({
  patient_id: z.number().int().positive('Patient ID is required'),
  consultation_date: z.string().optional(),
  chief_complaints: z.string().optional(),
  complaint_tags: z.array(z.string()).optional(),
  complaint_duration: z.string().optional(),
  past_history: z.string().optional(),
  family_history: z.string().optional(),
  surgical_history: z.string().optional(),
  general_examination: z.string().optional(),
  mental_state_examination: z.string().optional(),
  clinical_notes: z.string().optional(),
  diagnosis: z.string().optional(),
  treatment_plan: z.string().optional(),
  follow_up_notes: z.string().optional(),
  next_follow_up_date: z.string().optional(),
});

export const updateCaseRecordSchema = createCaseRecordSchema.partial();

// Prescription Schemas
export const createPrescriptionSchema = z.object({
  case_record_id: z.number().int().positive().optional(),
  patient_id: z.number().int().positive('Patient ID is required'),
  remedy_name: z.string().min(1, 'Remedy name is required'),
  potency: z.string().optional(),
  dosage: z.string().optional(),
  repetition: z.string().optional(),
  instructions: z.string().optional(),
  prescription_date: z.string().optional(),
  follow_up_date: z.string().optional(),
});

export const updatePrescriptionSchema = createPrescriptionSchema.partial();
