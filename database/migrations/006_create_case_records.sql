-- Create case_records table
-- This is the main EMR table that stores consultation records for each patient visit

CREATE TABLE IF NOT EXISTS case_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    consultation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Chief Complaints (with tags stored as JSONB array)
    chief_complaints TEXT,
    complaint_tags JSONB DEFAULT '[]'::jsonb,
    complaint_duration VARCHAR(100),

    -- History
    past_history TEXT,
    family_history TEXT,
    surgical_history TEXT,

    -- Examination Notes
    general_examination TEXT,
    mental_state_examination TEXT,

    -- Analysis & Diagnosis
    clinical_notes TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,

    -- Follow-up
    follow_up_notes TEXT,
    next_follow_up_date DATE,

    -- Metadata
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster patient lookups
CREATE INDEX IF NOT EXISTS idx_case_records_patient_id ON case_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_case_records_consultation_date ON case_records(consultation_date DESC);
CREATE INDEX IF NOT EXISTS idx_case_records_complaint_tags ON case_records USING GIN (complaint_tags);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_case_record_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_case_record_updated_at
    BEFORE UPDATE ON case_records
    FOR EACH ROW
    EXECUTE FUNCTION update_case_record_timestamp();

-- Add comments for documentation
COMMENT ON TABLE case_records IS 'Main EMR table storing consultation records for patient visits';
COMMENT ON COLUMN case_records.complaint_tags IS 'JSONB array of complaint tags for easy filtering and search';
COMMENT ON COLUMN case_records.chief_complaints IS 'Free-text field for detailed complaint description';
