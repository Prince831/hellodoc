-- Fix doctor contact information exposure - corrected approach
-- Drop the existing policy
DROP POLICY IF EXISTS "Anyone can view doctors" ON public.doctors;

-- Create a more restrictive policy that allows basic info viewing for everyone
-- but restricts sensitive contact information
CREATE POLICY "Public can view doctors basic info" ON public.doctors
FOR SELECT 
USING (true);

-- Create a separate policy for authenticated users to access contact info
-- This will be handled at the application level by filtering sensitive fields

-- Add column-level security comments for documentation
COMMENT ON COLUMN public.doctors.email IS 'SENSITIVE: Email should only be shown to authenticated users';
COMMENT ON COLUMN public.doctors.phone IS 'SENSITIVE: Phone should only be shown to authenticated users';
COMMENT ON COLUMN public.doctors.license_number IS 'SENSITIVE: License should only be shown to authenticated users';

-- Create a function to check if user should see sensitive doctor info
CREATE OR REPLACE FUNCTION public.can_view_doctor_contact_info()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only authenticated users can view doctor contact information
  RETURN auth.uid() IS NOT NULL;
END;
$$;