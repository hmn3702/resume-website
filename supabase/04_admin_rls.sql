-- ─────────────────────────────────────────────────────────────────────────────
-- Phase 4: Admin-only write policies
-- Primary admin: nghia03072002@gmail.com (second admin is added in 05_add_admin.sql).
-- ─────────────────────────────────────────────────────────────────────────────

-- Replace this with your actual email address:
-- (used as a constant so you only need to change it in one place)

DO $$
DECLARE
  admin_email TEXT := 'nghia03072002@gmail.com';  -- primary admin account
BEGIN

  -- Loop over all public tables and create INSERT/UPDATE/DELETE policies
  -- that restrict writes to the single admin email.

  -- profile
  EXECUTE format('
    CREATE POLICY "Admin can insert profile"
    ON public.profile FOR INSERT
    WITH CHECK (auth.jwt() ->> ''email'' = %L)', admin_email);

  EXECUTE format('
    CREATE POLICY "Admin can update profile"
    ON public.profile FOR UPDATE
    USING (auth.jwt() ->> ''email'' = %L)', admin_email);

  EXECUTE format('
    CREATE POLICY "Admin can delete profile"
    ON public.profile FOR DELETE
    USING (auth.jwt() ->> ''email'' = %L)', admin_email);

  -- experience
  EXECUTE format('
    CREATE POLICY "Admin can insert experience"
    ON public.experience FOR INSERT
    WITH CHECK (auth.jwt() ->> ''email'' = %L)', admin_email);

  EXECUTE format('
    CREATE POLICY "Admin can update experience"
    ON public.experience FOR UPDATE
    USING (auth.jwt() ->> ''email'' = %L)', admin_email);

  EXECUTE format('
    CREATE POLICY "Admin can delete experience"
    ON public.experience FOR DELETE
    USING (auth.jwt() ->> ''email'' = %L)', admin_email);

  -- education
  EXECUTE format('
    CREATE POLICY "Admin can insert education"
    ON public.education FOR INSERT
    WITH CHECK (auth.jwt() ->> ''email'' = %L)', admin_email);

  EXECUTE format('
    CREATE POLICY "Admin can update education"
    ON public.education FOR UPDATE
    USING (auth.jwt() ->> ''email'' = %L)', admin_email);

  EXECUTE format('
    CREATE POLICY "Admin can delete education"
    ON public.education FOR DELETE
    USING (auth.jwt() ->> ''email'' = %L)', admin_email);

  -- skills
  EXECUTE format('
    CREATE POLICY "Admin can insert skills"
    ON public.skills FOR INSERT
    WITH CHECK (auth.jwt() ->> ''email'' = %L)', admin_email);

  EXECUTE format('
    CREATE POLICY "Admin can update skills"
    ON public.skills FOR UPDATE
    USING (auth.jwt() ->> ''email'' = %L)', admin_email);

  EXECUTE format('
    CREATE POLICY "Admin can delete skills"
    ON public.skills FOR DELETE
    USING (auth.jwt() ->> ''email'' = %L)', admin_email);

  -- certifications
  EXECUTE format('
    CREATE POLICY "Admin can insert certifications"
    ON public.certifications FOR INSERT
    WITH CHECK (auth.jwt() ->> ''email'' = %L)', admin_email);

  EXECUTE format('
    CREATE POLICY "Admin can update certifications"
    ON public.certifications FOR UPDATE
    USING (auth.jwt() ->> ''email'' = %L)', admin_email);

  EXECUTE format('
    CREATE POLICY "Admin can delete certifications"
    ON public.certifications FOR DELETE
    USING (auth.jwt() ->> ''email'' = %L)', admin_email);

  -- projects
  EXECUTE format('
    CREATE POLICY "Admin can insert projects"
    ON public.projects FOR INSERT
    WITH CHECK (auth.jwt() ->> ''email'' = %L)', admin_email);

  EXECUTE format('
    CREATE POLICY "Admin can update projects"
    ON public.projects FOR UPDATE
    USING (auth.jwt() ->> ''email'' = %L)', admin_email);

  EXECUTE format('
    CREATE POLICY "Admin can delete projects"
    ON public.projects FOR DELETE
    USING (auth.jwt() ->> ''email'' = %L)', admin_email);

END $$;
