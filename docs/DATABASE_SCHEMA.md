# Database Schema - Dr. ZAID's Homeo Care EMR System

## Complete PostgreSQL Schema

### 1. Users Table (Authentication)

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'doctor',
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### 2. Patients Table

```sql
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    case_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    age INTEGER,
    gender VARCHAR(20),
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(255),
    occupation VARCHAR(255),
    address TEXT,
    lifestyle_habits TEXT,
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patients_case_id ON patients(case_id);
CREATE INDEX idx_patients_name ON patients(full_name);
CREATE INDEX idx_patients_phone ON patients(contact_phone);
```

### 3. Case Records Table (Minimalist EMR)

```sql
CREATE TABLE case_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    created_by INTEGER NOT NULL REFERENCES users(id),

    -- Minimalist Approach: Free-text fields with optional JSON
    chief_complaints TEXT NOT NULL,
    complaint_tags JSONB,

    past_family_history TEXT,
    general_mental_notes TEXT,
    examination_notes TEXT,

    -- Vitals (structured)
    bp_systolic INTEGER,
    bp_diastolic INTEGER,
    pulse INTEGER,
    temperature DECIMAL(4,1),
    weight DECIMAL(5,2),
    height DECIMAL(5,2),

    -- Investigation files
    investigation_files JSONB,

    -- Analysis
    analysis_notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_case_records_patient ON case_records(patient_id);
CREATE INDEX idx_case_records_created_at ON case_records(created_at DESC);
```

### 4. Prescriptions Table

```sql
CREATE TABLE prescriptions (
    id SERIAL PRIMARY KEY,
    case_record_id INTEGER REFERENCES case_records(id) ON DELETE CASCADE,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    prescribed_by INTEGER NOT NULL REFERENCES users(id),

    remedy_name VARCHAR(255) NOT NULL,
    potency VARCHAR(50),
    dosage VARCHAR(255),
    repetition VARCHAR(255),
    instructions TEXT,

    prescription_date DATE NOT NULL,
    follow_up_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_remedy ON prescriptions(remedy_name);
```

### 5. Follow-ups Table

```sql
CREATE TABLE follow_ups (
    id SERIAL PRIMARY KEY,
    case_record_id INTEGER NOT NULL REFERENCES case_records(id) ON DELETE CASCADE,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,

    follow_up_date DATE NOT NULL,
    progress_notes TEXT,
    remedy_response VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_follow_ups_patient ON follow_ups(patient_id);
```

### 6. Appointments Table

```sql
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE SET NULL,

    patient_name VARCHAR(255),
    patient_phone VARCHAR(20) NOT NULL,
    patient_email VARCHAR(255),

    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    service_type VARCHAR(100),
    consultation_mode VARCHAR(50) DEFAULT 'clinic',

    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    reminder_sent BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
```

### 7. Invoices Table

```sql
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE SET NULL,

    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    invoice_date DATE NOT NULL,

    items JSONB NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,

    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoices_patient ON invoices(patient_id);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
```

### 8. Blogs Table

```sql
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(500),

    category VARCHAR(100),
    tags JSONB,
    status VARCHAR(50) DEFAULT 'draft',

    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_status ON blogs(status);
```

---

## Sample Data

### Insert Doctor User
```sql
INSERT INTO users (email, password_hash, full_name, role, phone)
VALUES (
    'dr.zaid@homeocare.com',
    '$2b$10$encrypted_password_here',
    'Dr. MD Zaid',
    'doctor',
    '+91XXXXXXXXXX'
);
```

### Insert Sample Patient
```sql
INSERT INTO patients (case_id, full_name, age, gender, contact_phone)
VALUES (
    'CASE000001',
    'John Doe',
    35,
    'male',
    '+919876543210'
);
```

---

## Useful Queries

### Get Complete Patient Timeline
```sql
SELECT
    'case_record' as type,
    created_at as event_date,
    chief_complaints as details
FROM case_records
WHERE patient_id = 1

UNION ALL

SELECT
    'prescription' as type,
    prescription_date as event_date,
    remedy_name || ' - ' || potency as details
FROM prescriptions
WHERE patient_id = 1

UNION ALL

SELECT
    'follow_up' as type,
    follow_up_date as event_date,
    progress_notes as details
FROM follow_ups
WHERE patient_id = 1

ORDER BY event_date DESC;
```

### Search Patients
```sql
SELECT * FROM patients
WHERE
    full_name ILIKE '%search%'
    OR contact_phone ILIKE '%search%'
    OR case_id ILIKE '%search%'
ORDER BY created_at DESC;
```

### Today's Appointments
```sql
SELECT
    a.*,
    p.full_name,
    p.case_id
FROM appointments a
LEFT JOIN patients p ON a.patient_id = p.id
WHERE a.appointment_date = CURRENT_DATE
  AND a.status != 'cancelled'
ORDER BY a.appointment_time;
```

---

## Migration Scripts

Create these files in `database/migrations/`:

```
001_create_users.sql
002_create_patients.sql
003_create_case_records.sql
004_create_prescriptions.sql
005_create_follow_ups.sql
006_create_appointments.sql
007_create_invoices.sql
008_create_blogs.sql
```

This keeps your database changes version-controlled and easy to deploy.
