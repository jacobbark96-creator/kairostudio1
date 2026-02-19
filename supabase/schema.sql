-- Create a table for invoices
create table if not exists invoices (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  client_name text not null,
  amount numeric not null,
  status text check (status in ('pending', 'paid', 'overdue')) default 'pending',
  due_date date,
  file_url text,
  file_path text
);

-- Enable Row Level Security (RLS)
alter table invoices enable row level security;

-- Create policies
-- Allow users to view their own invoices
create policy "Users can view own invoices"
  on invoices for select
  using (auth.uid() = user_id);

-- Allow users to insert their own invoices
create policy "Users can insert own invoices"
  on invoices for insert
  with check (auth.uid() = user_id);

-- Allow users to update their own invoices
create policy "Users can update own invoices"
  on invoices for update
  using (auth.uid() = user_id);

-- Allow users to delete their own invoices
create policy "Users can delete own invoices"
  on invoices for delete
  using (auth.uid() = user_id);

-- Create a storage bucket for invoices if it doesn't exist
insert into storage.buckets (id, name, public)
values ('invoices', 'invoices', true)
on conflict (id) do nothing;

-- Set up storage policies
create policy "Invoice images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'invoices' );

create policy "Users can upload invoice images"
  on storage.objects for insert
  with check ( bucket_id = 'invoices' and auth.uid() = owner );

create policy "Users can delete own invoice images"
  on storage.objects for delete
  using ( bucket_id = 'invoices' and auth.uid() = owner );
