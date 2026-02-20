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

-- Allow users to insert their own invoices (This should be admin only, but for now kept as user)
-- We will restrict this later to admin only
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

-- ADMIN POLICIES FOR INVOICES --
create policy "Admins can view all invoices"
  on invoices for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can insert all invoices"
  on invoices for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can update all invoices"
  on invoices for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can delete all invoices"
  on invoices for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

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

-- ADMIN POLICIES FOR STORAGE --
create policy "Admins can upload invoice images"
  on storage.objects for insert
  with check (
    bucket_id = 'invoices' 
    and exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can delete any invoice image"
  on storage.objects for delete
  using (
    bucket_id = 'invoices'
    and exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- --- NEW SCHEMA FOR PROFILES AND CONTENT ---

-- Create profiles table
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- ADMIN POLICIES FOR PROFILES --
create policy "Admins can update any profile"
  on profiles for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Site Content Table (for Hero Text editing)
create table if not exists site_content (
  key text primary key,
  value text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table site_content enable row level security;

-- Policies for site_content
create policy "Anyone can read site content"
  on site_content for select
  using (true);

create policy "Only admins can update site content"
  on site_content for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Insert default content
insert into site_content (key, value)
values 
  ('hero_title', 'We craft digital experiences that inspire'),
  ('hero_subtitle', 'Transform your vision into stunning digital realities. We blend creativity with technology to build brands that captivate and convert.')
on conflict (key) do nothing;
