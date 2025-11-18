-- Create Case Records Table (Minimalist EMR)
CREATE TABLE IF NOT EXISTS case_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    created_by INTEGER NOT NULL REFERENCES users(id),

    -- Minimalist approach: Free-text fields with optional JSON for structured data
    chief_complaints TEXT NOT NULL,
    complaint_tags JSONB,
    -- Example: ["morning", "severe", "frontal"]

    past_family_history TEXT,
    general_mental_notes TEXT,
    examination_notes TEXT,

    -- Vitals (structured for easier querying)
    bp_systolic INTEGER,
    bp_diastolic INTEGER,
    pulse INTEGER,
    temperature DECIMAL(4,1),
    weight DECIMAL(5,2),
    height DECIMAL(5,2),

    -- Investigation files
    investigation_files JSONB,
    -- Example: [{"filename": "xray.jpg", "url": "/uploads/xray.jpg", "type": "xray", "date": "2024-01-01"}]

    -- Analysis
    analysis_notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_case_records_patient ON case_records(patient_id);
CREATE INDEX idx_case_records_created_at ON case_records(created_at DESC);
CREATE INDEX idx_case_records_created_by ON case_records(created_by);
CREATE INDEX idx_case_records_complaint_tags ON case_records USING GIN (complaint_tags);

-- Updated_at trigger
CREATE TRIGGER update_case_records_updated_at
    BEFORE UPDATE ON case_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE case_records IS 'Stores patient case records and consultations (minimalist approach)';
COMMENT ON COLUMN case_records.chief_complaints IS 'Main complaints in free text format';
COMMENT ON COLUMN case_records.complaint_tags IS 'Tags for symptom categorization like ["morning", "severe"]';
COMMENT ON COLUMN case_records.investigation_files IS 'JSON array of uploaded investigation reports';
