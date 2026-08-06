ALTER VIEW public.doctors_public SET (security_invoker = on);

CREATE POLICY "Anyone can view verified doctors"
ON public.doctors FOR SELECT TO anon
USING (verified = true);

GRANT SELECT (id, name, specialization, keywords, years_of_experience, rating,
  availability, image_url, bio, education, languages, consultation_fee,
  hospital, consultation_types, verified, created_at)
ON public.doctors TO anon;