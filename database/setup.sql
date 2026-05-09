-- Dr. Zaid Homeocare Database Setup Script
-- Run this file to create all tables in the correct order

-- Enable UUID extension (if needed in future)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Run migrations in order (absolute paths for Docker container)
\i /docker-entrypoint-initdb.d/migrations/001_create_users.sql
\i /docker-entrypoint-initdb.d/migrations/002_create_patients.sql
\i /docker-entrypoint-initdb.d/migrations/006_create_case_records.sql
\i /docker-entrypoint-initdb.d/migrations/004_create_prescriptions.sql
\i /docker-entrypoint-initdb.d/migrations/005_create_appointments.sql
\i /docker-entrypoint-initdb.d/migrations/007_create_vitals.sql
\i /docker-entrypoint-initdb.d/migrations/008_create_investigations.sql
\i /docker-entrypoint-initdb.d/migrations/009_fix_prescription_trigger.sql

-- Create a sample admin user (password: admin123)
-- Hash generated for 'admin123'
INSERT INTO users (email, password_hash, full_name, role, phone)
VALUES (
    'dr.zaid@homeocare.com',
    '$2b$10$XeGscYOxRQpl2TNBKW3c9eSqG/ua7hu4wfv0Ek/4XRnbyI9yM2nMi', 
    'Dr. MD Zaid',
    'doctor',
    '+910000000000'
) ON CONFLICT (email) DO NOTHING;

-- Grant necessary privileges
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO homeocare_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO homeocare_user;

COMMENT ON DATABASE homeocare_db IS 'Dr. Zaid Homeocare Clinic Management System Database';

-- Display success message
SELECT 'Database setup completed successfully!' AS status;
