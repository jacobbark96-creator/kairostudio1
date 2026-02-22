
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  category text not null,
  description text not null,
  image_url text,
  link text,
  featured boolean default false,
  color text,
  client_name text,
  client_industry text,
  client_location text,
  challenge text,
  solution text,
  features text[],
  technologies text[],
  results text[]
);

-- Enable RLS
alter table public.projects enable row level security;

-- Policies
create policy "Public projects are viewable by everyone"
  on public.projects for select
  using (true);

create policy "Admins can insert projects"
  on public.projects for insert
  with check (auth.uid() in (select id from public.profiles where role = 'admin'));

create policy "Admins can update projects"
  on public.projects for update
  using (auth.uid() in (select id from public.profiles where role = 'admin'));

create policy "Admins can delete projects"
  on public.projects for delete
  using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- Storage bucket for portfolio
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

create policy "Portfolio images are viewable by everyone"
  on storage.objects for select
  using ( bucket_id = 'portfolio' );

create policy "Admins can upload portfolio images"
  on storage.objects for insert
  with check ( bucket_id = 'portfolio' and auth.uid() in (select id from public.profiles where role = 'admin') );

create policy "Admins can update portfolio images"
  on storage.objects for update
  using ( bucket_id = 'portfolio' and auth.uid() in (select id from public.profiles where role = 'admin') );

create policy "Admins can delete portfolio images"
  on storage.objects for delete
  using ( bucket_id = 'portfolio' and auth.uid() in (select id from public.profiles where role = 'admin') );
