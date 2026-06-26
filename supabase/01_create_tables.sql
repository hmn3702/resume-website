-- ============================================================
-- Phase 2 — Step 1: Create all tables
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- profile
-- ------------------------------------------------------------
create table if not exists public.profile (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  title        text not null,
  bio          text,
  avatar_url   text,
  cv_url       text,
  email        text,
  linkedin_url text,
  github_url   text,
  location     text,
  updated_at   timestamptz not null default now()
);

-- ------------------------------------------------------------
-- experience
-- ------------------------------------------------------------
create table if not exists public.experience (
  id          uuid primary key default gen_random_uuid(),
  role        text not null,
  company     text not null,
  location    text,
  start_date  date not null,
  end_date    date,
  is_current  boolean not null default false,
  description text,
  "order"     integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- education
-- ------------------------------------------------------------
create table if not exists public.education (
  id          uuid primary key default gen_random_uuid(),
  institution text not null,
  degree      text not null,
  field       text not null,
  start_year  integer not null,
  end_year    integer,
  description text,
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- skills
-- ------------------------------------------------------------
create table if not exists public.skills (
  id       uuid primary key default gen_random_uuid(),
  name     text not null,
  category text not null,
  level    text not null check (level in ('beginner','intermediate','advanced','expert')),
  "order"  integer not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- certifications
-- ------------------------------------------------------------
create table if not exists public.certifications (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  issuer         text not null,
  year           integer not null,
  credential_url text,
  image_url      text,
  created_at     timestamptz not null default now()
);

-- ------------------------------------------------------------
-- projects
-- ------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null,
  tech_stack  text[] not null default '{}',
  live_url    text,
  github_url  text,
  image_url   text,
  featured    boolean not null default false,
  "order"     integer not null default 0,
  created_at  timestamptz not null default now()
);
