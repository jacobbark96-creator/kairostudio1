-- Create a public bucket for media uploads
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Allow public read access to the media bucket
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'media' );

-- Allow authenticated admins to insert/upload files
create policy "Admins can upload"
on storage.objects for insert
with check (
  bucket_id = 'media' 
  and auth.role() = 'authenticated'
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- Allow authenticated admins to update files
create policy "Admins can update"
on storage.objects for update
using (
  bucket_id = 'media' 
  and auth.role() = 'authenticated'
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- Allow authenticated admins to delete files
create policy "Admins can delete"
on storage.objects for delete
using (
  bucket_id = 'media' 
  and auth.role() = 'authenticated'
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);