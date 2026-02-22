-- Add price column to offers table
alter table offers 
add column if not exists price numeric default 0;

-- Update existing offers with a default price if needed (optional)
-- update offers set price = 500 where price is null;
