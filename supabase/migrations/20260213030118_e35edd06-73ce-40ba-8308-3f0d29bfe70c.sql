
-- Drop all existing restrictive policies on active_sessions
DROP POLICY IF EXISTS "Anyone can delete old sessions" ON public.active_sessions;
DROP POLICY IF EXISTS "Anyone can update sessions" ON public.active_sessions;
DROP POLICY IF EXISTS "Anyone can upsert sessions" ON public.active_sessions;
DROP POLICY IF EXISTS "Authenticated users can read sessions" ON public.active_sessions;

-- Recreate as PERMISSIVE policies
CREATE POLICY "Anyone can insert sessions"
ON public.active_sessions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can update sessions"
ON public.active_sessions FOR UPDATE
TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can delete sessions"
ON public.active_sessions FOR DELETE
TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can read sessions"
ON public.active_sessions FOR SELECT
TO anon, authenticated
USING (true);
