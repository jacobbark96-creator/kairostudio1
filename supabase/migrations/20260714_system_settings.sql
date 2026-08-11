-- Create a secure table for internal system settings
CREATE TABLE IF NOT EXISTS internal_system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS but don't add any policies to keep it private from API
-- This ensures only the 'postgres' role (superuser) can read/write to it
ALTER TABLE internal_system_settings ENABLE ROW LEVEL SECURITY;

-- Function to securely retrieve a setting
CREATE OR REPLACE FUNCTION get_system_setting(setting_key TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN (SELECT value FROM internal_system_settings WHERE key = setting_key);
END;
$$;
