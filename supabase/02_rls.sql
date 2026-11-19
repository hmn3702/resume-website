-- ============================================================
-- Phase 2 - Step 2: Row Level Security
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
-- Public READ - anyone (including the website) can read
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
-- WRITE access is NOT granted here.
-- Writes are restricted to the admin account(s) only - see
-- 04_admin_rls.sql (set your email there) and 05_add_admin.sql.
-- (A former "auth_write_*" block let ANY signed-in user write;
--  it was removed from the live database and from this file.)
-- ------------------------------------------------------------
