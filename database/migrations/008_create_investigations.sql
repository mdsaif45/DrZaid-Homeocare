-- Create investigations table
-- Stores investigation details and file uploads (lab reports, X-rays, etc.)

CREATE TABLE IF NOT EXISTS investigations (
    id SERIAL PRIMARY KEY,
    case_record_id INTEGER NOT NULL REFERENCES case_records(id) ON DELETE CASCADE,

    -- Investigation Details
    investigation_type VARCHAR(100), -- e.g., "Blood Test", "X-Ray", "MRI", "ECG"
    investigation_name VARCHAR(255), -- e.g., "Complete Blood Count", "Chest X-Ray"
    notes TEXT,
    findings TEXT,

    -- File Information
    file_url VARCHAR(500), -- Path to uploaded file
    file_name VARCHAR(255), -- Original file name
    file_type VARCHAR(50), -- MIME type (image/png, application/pdf, etc.)
    file_size INTEGER, -- File size in bytes

    -- Dates
    investigation_date DATE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster case record lookups
CREATE INDEX IF NOT EXISTS idx_investigations_case_record_id ON investigations(case_record_id);
CREATE INDEX IF NOT EXISTS idx_investigations_investigation_date ON investigations(investigation_date DESC);
CREATE INDEX IF NOT EXISTS idx_investigations_type ON investigations(investigation_type);

-- Add comments
COMMENT ON TABLE investigations IS 'Stores investigation records with optional file uploads';
COMMENT ON COLUMN investigations.file_url IS 'Path to uploaded file (stored in uploads directory)';
COMMENT ON COLUMN investigations.investigation_type IS 'Category of investigation for filtering';
