-- Create vitals table
-- Stores vital signs for each case record

CREATE TABLE IF NOT EXISTS vitals (
    id SERIAL PRIMARY KEY,
    case_record_id INTEGER NOT NULL REFERENCES case_records(id) ON DELETE CASCADE,

    -- Vital Signs
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    pulse_rate INTEGER,
    respiratory_rate INTEGER,
    temperature DECIMAL(4, 1),
    temperature_unit VARCHAR(1) DEFAULT 'C', -- 'C' for Celsius, 'F' for Fahrenheit
    oxygen_saturation INTEGER, -- SpO2 percentage

    -- Physical Measurements
    height DECIMAL(5, 2), -- in cm
    weight DECIMAL(5, 2), -- in kg
    bmi DECIMAL(4, 2), -- calculated or manual

    -- Additional Notes
    notes TEXT,

    -- Timestamp
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster case record lookups
CREATE INDEX IF NOT EXISTS idx_vitals_case_record_id ON vitals(case_record_id);

-- Add function to calculate BMI automatically
CREATE OR REPLACE FUNCTION calculate_bmi()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.height IS NOT NULL AND NEW.weight IS NOT NULL AND NEW.height > 0 THEN
        NEW.bmi = ROUND((NEW.weight / ((NEW.height / 100) * (NEW.height / 100)))::numeric, 2);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_vitals_bmi
    BEFORE INSERT OR UPDATE ON vitals
    FOR EACH ROW
    EXECUTE FUNCTION calculate_bmi();

-- Add comments
COMMENT ON TABLE vitals IS 'Stores vital signs and physical measurements for each case record';
COMMENT ON COLUMN vitals.bmi IS 'Auto-calculated from height and weight if both provided';
