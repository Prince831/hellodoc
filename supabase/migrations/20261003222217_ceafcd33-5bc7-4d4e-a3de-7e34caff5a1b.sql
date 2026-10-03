DROP POLICY IF EXISTS "Anyone can view appointment statuses" ON public.appointment_statuses;
CREATE POLICY "Signed-in users can view appointment statuses" ON public.appointment_statuses
  FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
REVOKE SELECT ON public.appointment_statuses FROM anon;

DROP POLICY IF EXISTS "Anyone can view medical conditions" ON public.medical_conditions;
CREATE POLICY "Signed-in users can view medical conditions" ON public.medical_conditions
  FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
REVOKE SELECT ON public.medical_conditions FROM anon;

DROP POLICY IF EXISTS "Anyone can view doctor unavailability" ON public.doctor_unavailability;
CREATE POLICY "Doctors and admins can view unavailability" ON public.doctor_unavailability
  FOR SELECT TO authenticated
  USING (doctor_id = public.current_doctor_id() OR public.has_role(auth.uid(), 'admin'::public.app_role));
REVOKE SELECT ON public.doctor_unavailability FROM anon;