-- Add amount_paid column to invoices table
alter table invoices 
add column if not exists amount_paid numeric default 0;

-- Ensure status can handle 'partial' if not already (it was constrained to pending, paid, overdue)
-- We need to drop the constraint and add a new one or just let it be text
alter table invoices drop constraint if exists invoices_status_check;
alter table invoices add constraint invoices_status_check check (status in ('pending', 'paid', 'overdue', 'partial'));
