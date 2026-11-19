-- ============================================================
-- 09: Case-study pages for projects (/projects/[slug])
-- Run AFTER 01–08. Safe to re-run.
-- Existing RLS on public.projects already covers the new columns:
-- public read (non-hidden only), admin-only write.
-- ============================================================

alter table public.projects
  add column if not exists slug     text,
  add column if not exists problem  text,
  add column if not exists data     text,
  add column if not exists approach text,
  add column if not exists insights text,
  add column if not exists outcome  text,
  add column if not exists gallery  text[] not null default '{}';

-- Backfill slugs from titles ("Coffee Shop Sales" -> "coffee-shop-sales").
-- Duplicate titles get -2, -3, ... Edit any slug later in the admin panel.
with base as (
  select id, created_at,
         coalesce(nullif(trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g')), ''), 'project') as s
  from public.projects
  where slug is null
), numbered as (
  select id, s, row_number() over (partition by s order by created_at) as n
  from base
)
update public.projects p
set slug = case when numbered.n = 1 then numbered.s else numbered.s || '-' || numbered.n end
from numbered
where p.id = numbered.id;

alter table public.projects alter column slug set not null;

alter table public.projects drop constraint if exists projects_slug_format;
alter table public.projects add constraint projects_slug_format
  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80);

create unique index if not exists projects_slug_key on public.projects (slug);

-- Check the generated slugs:
-- select title, slug from public.projects order by created_at;
