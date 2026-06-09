-- TalentVault AI — Storage bucket for resume files
-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

-- 1. Create the bucket (name MUST be exactly "resumes")
insert into storage.buckets (id, name, public, file_size_limit)
values (
  'resumes',
  'resumes',
  false,
  10485760 -- 10 MB per file
)
on conflict (id) do nothing;

-- 2. Storage policies (service role bypasses RLS, but these help if anon key is used)
create policy "Service can upload resumes"
  on storage.objects for insert
  to authenticated, anon
  with check (bucket_id = 'resumes');

create policy "Service can read resumes"
  on storage.objects for select
  to authenticated, anon
  using (bucket_id = 'resumes');

create policy "Service can update resumes"
  on storage.objects for update
  to authenticated, anon
  using (bucket_id = 'resumes');
