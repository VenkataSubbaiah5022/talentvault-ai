-- TalentVault AI — candidates schema
-- Run in Supabase SQL Editor

create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Contact (regex from raw text, before scrubbing)
  name text,
  email text,
  phone text,
  linkedin_url text,
  github_url text,

  -- AI extraction (from scrubbed text only)
  skills text[] default '{}',
  years_experience numeric,
  recent_job_title text,
  location text,
  resume_summary text,

  -- File & text
  storage_path text,
  original_filename text not null,
  scrubbed_text text,

  processing_status text not null default 'pending'
    check (processing_status in ('pending', 'processing', 'completed', 'failed')),
  error_message text
);

create index if not exists idx_candidates_status on public.candidates (processing_status);
create index if not exists idx_candidates_created_at on public.candidates (created_at desc);
create index if not exists idx_candidates_years on public.candidates (years_experience);
create index if not exists idx_candidates_location on public.candidates (location);
create index if not exists idx_candidates_skills on public.candidates using gin (skills);

-- Storage bucket: create "resumes" bucket in Supabase Dashboard (public read optional for preview)

alter table public.candidates enable row level security;

create policy "Allow public read candidates"
  on public.candidates for select
  using (true);

create policy "Allow public insert candidates"
  on public.candidates for insert
  with check (true);

create policy "Allow public update candidates"
  on public.candidates for update
  using (true);
