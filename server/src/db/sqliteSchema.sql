-- Dr. Zaid Homeocare SQLite Database Schema

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'doctor',
  phone TEXT,
  avatar_url TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  occupation TEXT,
  address TEXT,
  lifestyle_habits TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS case_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  consultation_date TEXT DEFAULT CURRENT_TIMESTAMP,
  chief_complaints TEXT,
  complaint_tags TEXT,
  complaint_duration TEXT,
  past_history TEXT,
  family_history TEXT,
  surgical_history TEXT,
  general_examination TEXT,
  mental_state_examination TEXT,
  clinical_notes TEXT,
  diagnosis TEXT,
  treatment_plan TEXT,
  follow_up_notes TEXT,
  next_follow_up_date TEXT,
  created_by INTEGER REFERENCES users(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vitals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_record_id INTEGER NOT NULL REFERENCES case_records(id) ON DELETE CASCADE,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  pulse_rate INTEGER,
  respiratory_rate INTEGER,
  temperature REAL,
  temperature_unit TEXT DEFAULT 'C',
  oxygen_saturation REAL,
  height REAL,
  weight REAL,
  bmi REAL,
  notes TEXT,
  recorded_at TEXT DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS investigations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_record_id INTEGER NOT NULL REFERENCES case_records(id) ON DELETE CASCADE,
  investigation_type TEXT,
  investigation_name TEXT,
  notes TEXT,
  findings TEXT,
  file_url TEXT,
  file_name TEXT,
  file_type TEXT,
  file_size INTEGER,
  investigation_date TEXT,
  uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_record_id INTEGER REFERENCES case_records(id) ON DELETE SET NULL,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  prescribed_by INTEGER REFERENCES users(id),
  remedy_name TEXT NOT NULL,
  potency TEXT,
  dosage TEXT,
  repetition TEXT,
  instructions TEXT,
  prescription_date TEXT DEFAULT CURRENT_TIMESTAMP,
  follow_up_date TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER REFERENCES patients(id) ON DELETE SET NULL,
  patient_name TEXT,
  patient_phone TEXT NOT NULL,
  patient_email TEXT,
  appointment_date TEXT NOT NULL,
  appointment_time TEXT NOT NULL,
  service_type TEXT,
  consultation_mode TEXT DEFAULT 'clinic',
  status TEXT DEFAULT 'pending',
  notes TEXT,
  reminder_sent INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
