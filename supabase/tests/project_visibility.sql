BEGIN;
INSERT INTO public.projects (title, description, featured)
VALUES ('Visibility test', 'Temporary row rolled back after verification', true)
RETURNING set_config('test.project_id', id::text, true);
SELECT set_config('request.jwt.claims',
  json_build_object('sub', id, 'role', 'authenticated', 'email', email)::text, true)
FROM auth.users WHERE email = 'nnbq6300@gmail.com';
SET LOCAL ROLE authenticated;
DO $$
DECLARE affected integer;
BEGIN
  UPDATE public.projects SET hidden = true WHERE id = current_setting('test.project_id')::uuid;
  GET DIAGNOSTICS affected = ROW_COUNT;
  ASSERT affected = 1, 'Admin must be able to hide a project';
  ASSERT (SELECT hidden FROM public.projects WHERE id = current_setting('test.project_id')::uuid),
    'Admin must still see hidden projects';
END $$;
SET LOCAL ROLE anon;
SELECT set_config('request.jwt.claims', '{}', true);
DO $$ BEGIN
  ASSERT NOT EXISTS (SELECT 1 FROM public.projects WHERE id = current_setting('test.project_id')::uuid),
    'Anonymous visitors must not see hidden projects';
END $$;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated","email":"nonadmin@example.com"}', true);
DO $$ BEGIN
  ASSERT NOT EXISTS (SELECT 1 FROM public.projects WHERE id = current_setting('test.project_id')::uuid),
    'Other accounts must not see hidden projects';
END $$;
RESET ROLE;
SELECT set_config('request.jwt.claims',
  json_build_object('sub', id, 'role', 'authenticated', 'email', email)::text, true)
FROM auth.users WHERE email = 'nghia03072002@gmail.com';
SET LOCAL ROLE authenticated;
DO $$ DECLARE affected integer; BEGIN
  UPDATE public.projects SET hidden = false WHERE id = current_setting('test.project_id')::uuid;
  GET DIAGNOSTICS affected = ROW_COUNT;
  ASSERT affected = 1, 'Original admin must be able to show a hidden project';
END $$;
SET LOCAL ROLE anon;
SELECT set_config('request.jwt.claims', '{}', true);
DO $$ BEGIN
  ASSERT EXISTS (SELECT 1 FROM public.projects WHERE id = current_setting('test.project_id')::uuid),
    'Visitors must see the project again after showing it';
END $$;
ROLLBACK;
