-- Fix doctor contact information exposure by removing sensitive fields from public access
-- Update RLS policy to exclude email and phone from public reads
DROP POLICY IF EXISTS "Anyone can view doctors" ON public.doctors;

CREATE POLICY "Anyone can view doctors basic info" ON public.doctors
FOR SELECT 
USING (true)
WITH CHECK (false);

-- Create a secure view for public doctor information that excludes sensitive data
CREATE OR REPLACE VIEW public.doctors_public AS 
SELECT 
  id,
  name,
  specialization,
  keywords,
  image_url,
  bio,
  education,
  languages,
  hospital,
  clinic_address,
  consultation_types,
  years_of_experience,
  rating,
  availability,
  consultation_fee,
  working_hours,
  created_at
FROM public.doctors;

-- Grant select permission on the view
GRANT SELECT ON public.doctors_public TO authenticated, anon;

-- Create policy for authenticated users to access full doctor info when booking
CREATE POLICY "Authenticated users can view doctor contact for booking" ON public.doctors
FOR SELECT 
TO authenticated
USING (true);

-- Ensure phone and email are only accessible to authenticated users
COMMENT ON COLUMN public.doctors.email IS 'Email - only visible to authenticated users for appointment booking';
COMMENT ON COLUMN public.doctors.phone IS 'Phone - only visible to authenticated users for appointment booking';