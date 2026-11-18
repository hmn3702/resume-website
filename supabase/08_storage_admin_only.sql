-- ============================================================
-- 08: Restrict resume-assets storage writes to admin accounts
-- Previously ANY signed-in user could upload/overwrite/delete files.
-- Public read is kept (avatars, project images and the CV are public).
-- Admin emails match 04–07.
-- ============================================================

drop policy if exists "Auth users can upload resume-assets" on storage.objects;
drop policy if exists "Auth users can update resume-assets" on storage.objects;
drop policy if exists "Auth users can delete resume-assets" on storage.objects;

drop policy if exists "Admin can upload resume-assets" on storage.objects;
create policy "Admin can upload resume-assets"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'resume-assets'
    and (select auth.jwt() ->> 'email') in ('nghia03072002@gmail.com', 'nnbq6300@gmail.com'));

drop policy if exists "Admin can update resume-assets" on storage.objects;
create policy "Admin can update resume-assets"
  on storage.objects for update to authenticated
  using (bucket_id = 'resume-assets'
    and (select auth.jwt() ->> 'email') in ('nghia03072002@gmail.com', 'nnbq6300@gmail.com'));

drop policy if exists "Admin can delete resume-assets" on storage.objects;
create policy "Admin can delete resume-assets"
  on storage.objects for delete to authenticated
  using (bucket_id = 'resume-assets'
    and (select auth.jwt() ->> 'email') in ('nghia03072002@gmail.com', 'nnbq6300@gmail.com'));

-- Public read (unchanged, recreated here so a fresh project matches production)
drop policy if exists "Public read resume-assets" on storage.objects;
create policy "Public read resume-assets"
  on storage.objects for select
  using (bucket_id = 'resume-assets');
