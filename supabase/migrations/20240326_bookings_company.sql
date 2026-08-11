-- Add new columns to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS company_name text,
ADD COLUMN IF NOT EXISTS company_url text;