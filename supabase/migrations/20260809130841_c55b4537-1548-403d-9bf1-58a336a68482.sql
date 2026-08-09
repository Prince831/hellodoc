REVOKE ALL ON public.doctors_public FROM anon, authenticated;
GRANT SELECT ON public.doctors_public TO anon, authenticated;
GRANT ALL ON public.doctors_public TO service_role;