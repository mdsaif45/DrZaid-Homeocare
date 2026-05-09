import { Request } from 'express';

// User Types
export interface User {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  role: 'doctor' | 'admin';
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserResponse {
  id: number;
  email: string;
  full_name: string;
  role: 'doctor' | 'admin';
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role?: 'doctor' | 'admin';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

// Patient Types
export interface Patient {
  id: number;
  case_id: string;
  full_name: string;
  age?: number;
  gender?: string;
  contact_phone: string;
  contact_email?: string;
  occupation?: string;
  address?: string;
  lifestyle_habits?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePatientRequest {
  full_name: string;
  age?: number;
  gender?: string;
  contact_phone: string;
  contact_email?: string;
  occupation?: string;
  address?: string;
  lifestyle_habits?: string;
  emergency_contact?: string;
  emergency_phone?: string;
}

// Case Record Types
export interface CaseRecord {
  id: number;
  patient_id: number;
  consultation_date: Date;

  // Chief Complaints
  chief_complaints?: string;
  complaint_tags?: string[];
  complaint_duration?: string;

  // History
  past_history?: string;
  family_history?: string;
  surgical_history?: string;

  // Examination
  general_examination?: string;
  mental_state_examination?: string;

  // Analysis
  clinical_notes?: string;
  diagnosis?: string;
  treatment_plan?: string;

  // Follow-up
  follow_up_notes?: string;
  next_follow_up_date?: Date;

  // Relations (populated)
  vitals?: Vitals;
  investigations?: Investigation[];

  // Metadata
  created_by?: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCaseRecordRequest {
  patient_id: number;
  consultation_date?: string;
  chief_complaints?: string;
  complaint_tags?: string[];
  complaint_duration?: string;
  past_history?: string;
  family_history?: string;
  surgical_history?: string;
  general_examination?: string;
  mental_state_examination?: string;
  clinical_notes?: string;
  diagnosis?: string;
  treatment_plan?: string;
  follow_up_notes?: string;
  next_follow_up_date?: string;
}

// Vitals Types
export interface Vitals {
  id: number;
  case_record_id: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  pulse_rate?: number;
  respiratory_rate?: number;
  temperature?: number;
  temperature_unit?: 'C' | 'F';
  oxygen_saturation?: number;
  height?: number;
  weight?: number;
  bmi?: number;
  notes?: string;
  recorded_at: Date;
  created_at: Date;
}

export interface CreateVitalsRequest {
  case_record_id: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  pulse_rate?: number;
  respiratory_rate?: number;
  temperature?: number;
  temperature_unit?: 'C' | 'F';
  oxygen_saturation?: number;
  height?: number;
  weight?: number;
  notes?: string;
}

// Investigation Types
export interface Investigation {
  id: number;
  case_record_id: number;
  investigation_type?: string;
  investigation_name?: string;
  notes?: string;
  findings?: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  investigation_date?: Date;
  uploaded_at: Date;
  created_at: Date;
}

export interface CreateInvestigationRequest {
  case_record_id: number;
  investigation_type?: string;
  investigation_name?: string;
  notes?: string;
  findings?: string;
  investigation_date?: string;
}

// Prescription Types
export interface Prescription {
  id: number;
  case_record_id?: number;
  patient_id: number;
  prescribed_by: number;
  remedy_name: string;
  potency?: string;
  dosage?: string;
  repetition?: string;
  instructions?: string;
  prescription_date: Date;
  follow_up_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePrescriptionRequest {
  case_record_id?: number;
  patient_id: number;
  remedy_name: string;
  potency?: string;
  dosage?: string;
  repetition?: string;
  instructions?: string;
  prescription_date: string;
  follow_up_date?: string;
}

// Appointment Types
export interface Appointment {
  id: number;
  patient_id?: number;
  patient_name?: string;
  patient_phone: string;
  patient_email?: string;
  appointment_date: Date;
  appointment_time: string;
  service_type?: string;
  consultation_mode: 'clinic' | 'online_video' | 'online_phone';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  reminder_sent: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateAppointmentRequest {
  patient_id?: number;
  patient_name?: string;
  patient_phone: string;
  patient_email?: string;
  appointment_date: string;
  appointment_time: string;
  service_type?: string;
  consultation_mode?: 'clinic' | 'online_video' | 'online_phone';
  notes?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request with User (for authenticated routes)
export interface AuthRequest extends Request {
  user?: UserResponse;
}
