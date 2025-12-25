-- Drop existing restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Admins can view roles" ON public.user_roles;

-- Create permissive policy for viewing roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));