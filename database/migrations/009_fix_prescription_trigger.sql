-- Fix prescription trigger to use correct function name
-- Drop old trigger if exists
DROP TRIGGER IF EXISTS update_prescriptions_updated_at ON prescriptions;

-- Create the updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_prescription_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_prescriptions_updated_at
    BEFORE UPDATE ON prescriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_prescription_timestamp();

COMMENT ON FUNCTION update_prescription_timestamp() IS 'Updates the updated_at timestamp for prescriptions';
