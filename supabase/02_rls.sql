-- ============================================================
-- Phase 2 — Step 2: Row Level Security
-- Run AFTER 01_create_tables.sql
-- ============================================================

-- Enable RLS on every table
alter table public.profile        enable row level security;
alter table public.experience     enable row level security;
alter table public.education      enable row level security;
alter table public.skills         enable row level security;
alter table public.certifications enable row level security;
alter table public.projects       enable row level security;

-- ------------------------------------------------------------
-- Public READ — anyone (including the website) can read
-- ------------------------------------------------------------
create policy "public_read_profile"
  on public.profile for select using (true);

create policy "public_read_experience"
  on public.experience for select using (true);

create policy "public_read_education"
  on public.education for select using (true);

create policy "public_read_skills"
  on public.skills for select using (true);

create policy "public_read_certifications"
  on public.certifications for select using (true);

create policy "public_read_projects"
  on public.projects for select using (true);

-- ------------------------------------------------------------
-- Authenticated WRITE — only logged-in admin can mutate
-- ------------------------------------------------------------
create policy "auth_write_profile"
  on public.profile for all using (auth.role() = 'authenticated');

create policy "auth_write_experience"
  on public.experience for all using (auth.role() = 'authenticated');

create policy "auth_write_education"
  on public.education for all using (auth.role() = 'authenticated');

create policy "auth_write_skills"
  on public.skills for all using (auth.role() = 'authenticated');

create policy "auth_write_certifications"
  on public.certifications for all using (auth.role() = 'authenticated');

create policy "auth_write_projects"
  on public.projects for all using (auth.role() = 'authenticated');
