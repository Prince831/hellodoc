-- 1. Roles
CREATE TYPE public.app_role AS ENUM ('patient','doctor','admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- backfill roles from profiles
INSERT INTO public.user_roles (user_id, role)
SELECT p.id,
  CASE WHEN p.role = 'doctor' THEN 'doctor'::public.app_role
       WHEN p.role = 'admin' THEN 'admin'::public.app_role
       ELSE 'patient'::public.app_role END
FROM public.profiles p
ON CONFLICT DO NOTHING;

-- 2. Doctors linked to accounts
ALTER TABLE public.doctors
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS verified boolean NOT NULL DEFAULT true;

CREATE UNIQUE INDEX IF NOT EXISTS doctors_user_id_key ON public.doctors(user_id) WHERE user_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.current_doctor_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.doctors WHERE user_id = auth.uid() LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_treating_doctor(_patient_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.appointments a
    JOIN public.doctors d ON d.id = a.doctor_id
    WHERE d.user_id = auth.uid() AND a.user_id = _patient_id
  ) OR EXISTS (
    SELECT 1 FROM public.conversations c
    JOIN public.doctors d ON d.id = c.doctor_id
    WHERE d.user_id = auth.uid() AND c.patient_id = _patient_id
  )
$$;

GRANT UPDATE ON public.doctors TO authenticated;
GRANT INSERT ON public.doctors TO authenticated;

CREATE POLICY "Doctors can update their own record"
ON public.doctors FOR UPDATE TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Doctors can create their own record"
ON public.doctors FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- 3. Appointments: doctor access
CREATE POLICY "Doctors can view their appointments"
ON public.appointments FOR SELECT TO authenticated
USING (doctor_id = public.current_doctor_id());

CREATE POLICY "Doctors can update their appointments"
ON public.appointments FOR UPDATE TO authenticated
USING (doctor_id = public.current_doctor_id())
WITH CHECK (doctor_id = public.current_doctor_id());

-- 4. Profiles: treating doctors can read patient profile
CREATE POLICY "Doctors can view their patients profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.is_treating_doctor(id));

-- 5. Health records / labs / vitals / medications: doctor access
CREATE POLICY "Doctors can view patient health records"
ON public.health_records FOR SELECT TO authenticated
USING (public.is_treating_doctor(user_id));

CREATE POLICY "Doctors can create patient health records"
ON public.health_records FOR INSERT TO authenticated
WITH CHECK (public.is_treating_doctor(user_id));

CREATE POLICY "Doctors can view patient lab results"
ON public.lab_results FOR SELECT TO authenticated
USING (public.is_treating_doctor(user_id));

CREATE POLICY "Doctors can create patient lab results"
ON public.lab_results FOR INSERT TO authenticated
WITH CHECK (public.is_treating_doctor(user_id));

CREATE POLICY "Doctors can view patient vitals"
ON public.vitals FOR SELECT TO authenticated
USING (public.is_treating_doctor(user_id));

CREATE POLICY "Doctors can record patient vitals"
ON public.vitals FOR INSERT TO authenticated
WITH CHECK (public.is_treating_doctor(user_id));

CREATE POLICY "Doctors can view patient medications"
ON public.medications FOR SELECT TO authenticated
USING (public.is_treating_doctor(user_id));

CREATE POLICY "Doctors can prescribe medications"
ON public.medications FOR INSERT TO authenticated
WITH CHECK (public.is_treating_doctor(user_id));

CREATE POLICY "Doctors can update prescribed medications"
ON public.medications FOR UPDATE TO authenticated
USING (public.is_treating_doctor(user_id))
WITH CHECK (public.is_treating_doctor(user_id));

-- 6. Appointment notes
CREATE POLICY "Doctors can view appointment notes"
ON public.appointment_notes FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = appointment_id AND a.doctor_id = public.current_doctor_id()));

GRANT DELETE ON public.appointment_notes TO authenticated;
GRANT UPDATE ON public.appointment_notes TO authenticated;

CREATE POLICY "Authors can update their notes"
ON public.appointment_notes FOR UPDATE TO authenticated
USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can delete their notes"
ON public.appointment_notes FOR DELETE TO authenticated
USING (author_id = auth.uid());

-- 7. Conversations / messages
CREATE POLICY "Doctors can create conversations"
ON public.conversations FOR INSERT TO authenticated
WITH CHECK (doctor_id = public.current_doctor_id());

GRANT DELETE ON public.messages TO authenticated;
CREATE POLICY "Senders can delete their messages"
ON public.messages FOR DELETE TO authenticated
USING (sender_id = auth.uid());

-- 8. Notifications insert
GRANT INSERT ON public.notifications TO authenticated;
CREATE POLICY "Users can create notifications"
ON public.notifications FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id OR public.current_doctor_id() IS NOT NULL);

-- 9. Prescription items
GRANT SELECT, INSERT, UPDATE ON public.prescription_items TO authenticated;
CREATE POLICY "Doctors manage prescription items"
ON public.prescription_items FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.medications m WHERE m.id = medication_id AND public.is_treating_doctor(m.user_id)));

-- 10. Video consultations
GRANT SELECT, INSERT, UPDATE ON public.video_consultations TO authenticated;
CREATE POLICY "Participants can create video rooms"
ON public.video_consultations FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = appointment_id AND (a.user_id = auth.uid() OR a.doctor_id = public.current_doctor_id())));

CREATE POLICY "Participants can update video rooms"
ON public.video_consultations FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = appointment_id AND (a.user_id = auth.uid() OR a.doctor_id = public.current_doctor_id())))
WITH CHECK (true);

-- 11. Doctor schedules manageable by owning doctor
GRANT INSERT, UPDATE, DELETE ON public.doctor_schedules TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.doctor_unavailability TO authenticated;

CREATE POLICY "Doctors manage their schedules"
ON public.doctor_schedules FOR ALL TO authenticated
USING (doctor_id = public.current_doctor_id())
WITH CHECK (doctor_id = public.current_doctor_id());

CREATE POLICY "Doctors manage their unavailability"
ON public.doctor_unavailability FOR ALL TO authenticated
USING (doctor_id = public.current_doctor_id())
WITH CHECK (doctor_id = public.current_doctor_id());

-- 12. Symptom checks
GRANT SELECT, INSERT ON public.symptom_checks TO authenticated;

-- 13. Signup trigger also records the role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    CASE WHEN NEW.raw_user_meta_data->>'role' = 'doctor' THEN 'doctor'::public.app_role
         ELSE 'patient'::public.app_role END
  )
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;