DROP POLICY "Anyone can view doctor schedules" ON public.doctor_schedules;
CREATE POLICY "Admins can view doctor schedules" ON public.doctor_schedules FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
REVOKE ALL ON public.doctor_schedules FROM anon;
DROP POLICY "Anyone can view specializations" ON public.specializations;
CREATE POLICY "Signed-in users can view specializations" ON public.specializations FOR SELECT TO authenticated USING (true);
REVOKE ALL ON public.specializations FROM anon;