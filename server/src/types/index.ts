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
  created_by: number;
  chief_complaints: string;
  complaint_tags?: string[];
  past_family_history?: string;
  general_mental_notes?: string;
  examination_notes?: string;
  bp_systolic?: number;
  bp_diastolic?: number;
  pulse?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  investigation_files?: InvestigationFile[];
  analysis_notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface InvestigationFile {
  filename: string;
  url: string;
  type: string;
  date: string;
}

export interface CreateCaseRecordRequest {
  patient_id: number;
  chief_complaints: string;
  complaint_tags?: string[];
  past_family_history?: string;
  general_mental_notes?: string;
  examination_notes?: string;
  bp_systolic?: number;
  bp_diastolic?: number;
  pulse?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  analysis_notes?: string;
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
