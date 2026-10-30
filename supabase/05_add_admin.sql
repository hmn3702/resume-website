-- Keep existing admin policies and grant the second account content access.
DO $$
DECLARE
  admin_id uuid;
  table_name text;
BEGIN
  SELECT id INTO STRICT admin_id FROM auth.users WHERE email = 'nnbq6300@gmail.com';
  FOREACH table_name IN ARRAY ARRAY['profile', 'experience', 'education', 'certifications', 'skills', 'projects']
  LOOP
    EXECUTE format(
      'CREATE POLICY "Additional admin access" ON public.%I FOR ALL TO authenticated USING ((select auth.uid()) = %L::uuid) WITH CHECK ((select auth.uid()) = %L::uuid)',
      table_name, admin_id, admin_id
    );
  END LOOP;
END
$$;
