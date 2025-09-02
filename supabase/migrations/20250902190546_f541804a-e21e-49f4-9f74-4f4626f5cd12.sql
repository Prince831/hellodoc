-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.can_view_doctor_contact_info()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only authenticated users can view doctor contact information
  RETURN auth.uid() IS NOT NULL;
END;
$$;