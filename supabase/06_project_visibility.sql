ALTER TABLE public.projects ADD COLUMN hidden boolean NOT NULL DEFAULT false;
ALTER POLICY public_read_projects ON public.projects USING (NOT hidden);
CREATE POLICY "Admin can read hidden projects"
ON public.projects FOR SELECT TO authenticated
USING ((select auth.jwt() ->> 'email') = 'nghia03072002@gmail.com');
