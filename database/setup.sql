-- Dr. Zaid Homeocare Database Setup Script
-- Run this file to create all tables in the correct order

-- Enable UUID extension (if needed in future)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Run migrations in order
\i database/migrations/001_create_users.sql
\i database/migrations/002_create_patients.sql
\i database/migrations/003_create_case_records.sql
\i database/migrations/004_create_prescriptions.sql
\i database/migrations/005_create_appointments.sql

-- Create a sample admin user (password: admin123 - CHANGE THIS!)
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (email, password_hash, full_name, role, phone)
VALUES (
    'dr.zaid@homeocare.com',
    '$2b$10$YourHashedPasswordHere',
    'Dr. MD Zaid',
    'doctor',
    '+91XXXXXXXXXX'
) ON CONFLICT (email) DO NOTHING;

-- Grant necessary privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO homeocare_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO homeocare_user;

COMMENT ON DATABASE homeocare_db IS 'Dr. Zaid Homeocare Clinic Management System Database';

-- Display success message
SELECT 'Database setup completed successfully!' AS status;
