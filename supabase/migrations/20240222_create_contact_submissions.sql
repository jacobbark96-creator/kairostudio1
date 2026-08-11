-- Create a table for contact submissions
create table if not exists contact_submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  business text,
  email text not null,
  phone text,
  message text not null,
  subject text,
  website text,
  offer_price numeric,
  deposit_amount numeric,
  status text default 'new'
);

-- Enable Row Level Security (RLS)
alter table contact_submissions enable row level security;

-- Create policies
-- Allow anyone to insert (submit form)
create policy "Anyone can insert contact submissions"
  on contact_submissions for insert
  with check (true);

-- Only admins can view submissions
create policy "Admins can view contact submissions"
  on contact_submissions for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );
