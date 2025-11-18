-- Create Patients Table
CREATE TABLE IF NOT EXISTS patients (
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

-- Create indexes
CREATE INDEX idx_patients_case_id ON patients(case_id);
CREATE INDEX idx_patients_name ON patients(full_name);
CREATE INDEX idx_patients_phone ON patients(contact_phone);
CREATE INDEX idx_patients_created_at ON patients(created_at DESC);

-- Auto-generate case_id trigger
CREATE OR REPLACE FUNCTION generate_case_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.case_id IS NULL OR NEW.case_id = '' THEN
        NEW.case_id := 'CASE' || LPAD(NEXTVAL('patients_id_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_case_id_before_insert
    BEFORE INSERT ON patients
    FOR EACH ROW
    EXECUTE FUNCTION generate_case_id();

-- Updated_at trigger
CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE patients IS 'Stores patient demographic information';
COMMENT ON COLUMN patients.case_id IS 'Unique case identifier (auto-generated: CASE000001)';
COMMENT ON COLUMN patients.lifestyle_habits IS 'Information about diet, exercise, addictions, etc.';
