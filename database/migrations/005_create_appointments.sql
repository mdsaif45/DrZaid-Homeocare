-- Create Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE SET NULL,

    -- For new patients who haven't been created yet
    patient_name VARCHAR(255),
    patient_phone VARCHAR(20) NOT NULL,
    patient_email VARCHAR(255),

    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    service_type VARCHAR(100),
    consultation_mode VARCHAR(50) DEFAULT 'clinic',
    -- Values: 'clinic', 'online_video', 'online_phone'

    status VARCHAR(50) DEFAULT 'pending',
    -- Values: 'pending', 'confirmed', 'completed', 'cancelled', 'no_show'

    notes TEXT,
    reminder_sent BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_phone ON appointments(patient_phone);
CREATE INDEX idx_appointments_datetime ON appointments(appointment_date, appointment_time);

-- Updated_at trigger
CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Constraint: appointment_time in future
-- CREATE OR REPLACE FUNCTION check_appointment_time()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     IF NEW.appointment_date < CURRENT_DATE THEN
--         RAISE EXCEPTION 'Appointment date cannot be in the past';
--     END IF;
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER validate_appointment_time
--     BEFORE INSERT OR UPDATE ON appointments
--     FOR EACH ROW
--     EXECUTE FUNCTION check_appointment_time();

-- Comments
COMMENT ON TABLE appointments IS 'Stores patient appointments (both from existing patients and new bookings)';
COMMENT ON COLUMN appointments.patient_id IS 'Links to existing patient if available, null for new bookings';
COMMENT ON COLUMN appointments.consultation_mode IS 'Type of consultation: clinic, online_video, online_phone';
COMMENT ON COLUMN appointments.status IS 'Appointment status: pending, confirmed, completed, cancelled, no_show';
