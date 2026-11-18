-- ============================================================
-- 07: Contact form messages
-- Run AFTER 01–06. Safe to re-run (idempotent).
-- If the table was already created by hand in the dashboard,
-- this only adds the missing column, limits and policies.
-- ============================================================

create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  message    text not null,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages
  add column if not exists read boolean not null default false;

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

-- ------------------------------------------------------------
-- Basic abuse limits (anon key is public, so validate in the DB)
-- NOT VALID = applies to new rows only, existing rows are untouched
-- ------------------------------------------------------------
alter table public.contact_messages drop constraint if exists contact_messages_name_len;
alter table public.contact_messages add constraint contact_messages_name_len
  check (char_length(btrim(name)) between 1 and 100) not valid;

alter table public.contact_messages drop constraint if exists contact_messages_email_format;
alter table public.contact_messages add constraint contact_messages_email_format
  check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$') not valid;

alter table public.contact_messages drop constraint if exists contact_messages_message_len;
alter table public.contact_messages add constraint contact_messages_message_len
  check (char_length(btrim(message)) between 1 and 5000) not valid;

-- ------------------------------------------------------------
-- Row Level Security
--   anon / visitors : INSERT only (cannot read anyone's messages)
--   admin emails    : SELECT / UPDATE / DELETE
-- Admin emails match 05_add_admin.sql and 06_project_visibility.sql
-- ------------------------------------------------------------
alter table public.contact_messages enable row level security;

grant insert on public.contact_messages to anon, authenticated;
grant select, update, delete on public.contact_messages to authenticated;

drop policy if exists "Anyone can send a contact message" on public.contact_messages;
create policy "Anyone can send a contact message"
  on public.contact_messages for insert
  to anon, authenticated
  with check (read = false);

drop policy if exists "Admin can read messages" on public.contact_messages;
create policy "Admin can read messages"
  on public.contact_messages for select
  to authenticated
  using ((select auth.jwt() ->> 'email') in ('nghia03072002@gmail.com', 'nnbq6300@gmail.com'));

drop policy if exists "Admin can update messages" on public.contact_messages;
create policy "Admin can update messages"
  on public.contact_messages for update
  to authenticated
  using      ((select auth.jwt() ->> 'email') in ('nghia03072002@gmail.com', 'nnbq6300@gmail.com'))
  with check ((select auth.jwt() ->> 'email') in ('nghia03072002@gmail.com', 'nnbq6300@gmail.com'));

drop policy if exists "Admin can delete messages" on public.contact_messages;
create policy "Admin can delete messages"
  on public.contact_messages for delete
  to authenticated
  using ((select auth.jwt() ->> 'email') in ('nghia03072002@gmail.com', 'nnbq6300@gmail.com'));
