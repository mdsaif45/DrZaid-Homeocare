-- Create Prescriptions Table
CREATE TABLE IF NOT EXISTS prescriptions (
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

-- Create indexes
CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_case_record ON prescriptions(case_record_id);
CREATE INDEX idx_prescriptions_date ON prescriptions(prescription_date DESC);
CREATE INDEX idx_prescriptions_remedy ON prescriptions(remedy_name);
CREATE INDEX idx_prescriptions_follow_up ON prescriptions(follow_up_date) WHERE follow_up_date IS NOT NULL;

-- Updated_at trigger
CREATE TRIGGER update_prescriptions_updated_at
    BEFORE UPDATE ON prescriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE prescriptions IS 'Stores homeopathic prescriptions';
COMMENT ON COLUMN prescriptions.remedy_name IS 'Name of the homeopathic remedy';
COMMENT ON COLUMN prescriptions.potency IS 'Potency of the remedy (e.g., 30C, 200C, 1M)';
COMMENT ON COLUMN prescriptions.repetition IS 'How often to take the remedy';
