-- 1. Remove insecure has_role overload
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP FUNCTION IF EXISTS public.has_role(uuid, text);
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role));

-- 2. Prevent role self-escalation on profiles
CREATE OR REPLACE FUNCTION public.prevent_profile_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role
     AND NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    NEW.role := OLD.role;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_prevent_role_change ON public.profiles;
CREATE TRIGGER profiles_prevent_role_change
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_role_change();

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 3. Prevent doctor self-verification / trust field tampering
ALTER TABLE public.doctors ALTER COLUMN verified SET DEFAULT false;

CREATE OR REPLACE FUNCTION public.guard_doctor_trust_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.verified := false;
    NEW.rating := 0;
  ELSE
    NEW.verified := OLD.verified;
    NEW.rating := OLD.rating;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS doctors_guard_trust_fields ON public.doctors;
CREATE TRIGGER doctors_guard_trust_fields
BEFORE INSERT OR UPDATE ON public.doctors
FOR EACH ROW EXECUTE FUNCTION public.guard_doctor_trust_fields();

-- 4. Restrict public exposure of doctor contact / licence data
DROP POLICY IF EXISTS "Public can view doctors basic info" ON public.doctors;
CREATE POLICY "Authenticated users can view verified doctors"
ON public.doctors FOR SELECT TO authenticated
USING (verified = true OR user_id = auth.uid());

CREATE OR REPLACE VIEW public.doctors_public AS
SELECT id, name, specialization, keywords, years_of_experience, rating,
       availability, image_url, bio, education, languages, consultation_fee,
       hospital, consultation_types, verified, created_at
FROM public.doctors
WHERE verified = true;

-- 5. Fix appointment_notes insert check
DROP POLICY IF EXISTS "Users can create appointment notes" ON public.appointment_notes;
CREATE POLICY "Users can create appointment notes"
ON public.appointment_notes FOR INSERT TO authenticated
WITH CHECK (
  author_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.appointments a
    WHERE a.id = appointment_notes.appointment_id
      AND (a.user_id = auth.uid() OR a.doctor_id = public.current_doctor_id())
  )
);

DROP POLICY IF EXISTS "Users can view their appointment notes" ON public.appointment_notes;
CREATE POLICY "Users can view their appointment notes"
ON public.appointment_notes FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.appointments a
  WHERE a.id = appointment_notes.appointment_id AND a.user_id = auth.uid()
) AND is_private = false);

-- 6. Tighten table grants (remove blanket anon/authenticated ALL privileges)
DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('REVOKE ALL ON public.%I FROM anon, authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  END LOOP;
END $$;

-- reference data readable by everyone
GRANT SELECT ON public.appointment_statuses, public.specializations, public.medical_conditions TO anon, authenticated;
GRANT SELECT ON public.doctors_public TO anon, authenticated;

-- authenticated app tables
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.doctors TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointment_notes TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.conversations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.doctor_schedules TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.doctor_unavailability TO authenticated;
GRANT SELECT, INSERT ON public.health_records TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.lab_results TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.medications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;
GRANT SELECT, INSERT ON public.prescription_items TO authenticated;
GRANT SELECT, INSERT ON public.symptom_checks TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.video_consultations TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.vitals TO authenticated;

-- 7. Lock down SECURITY DEFINER function execution
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.prevent_profile_role_change() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.guard_doctor_trust_fields() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.can_view_doctor_contact_info() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.current_doctor_id() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_treating_doctor(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_doctor_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_treating_doctor(uuid) TO authenticated;