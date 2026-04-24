-- Fix: Restrict profiles SELECT to authenticated users only
DROP POLICY "Anyone can view profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);