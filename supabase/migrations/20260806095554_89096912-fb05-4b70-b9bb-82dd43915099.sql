GRANT SELECT, INSERT, UPDATE ON public.video_consultations TO authenticated;
GRANT ALL ON public.video_consultations TO service_role;

DROP POLICY IF EXISTS "Users can view their video consultations" ON public.video_consultations;
CREATE POLICY "Participants can view video rooms"
ON public.video_consultations
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.appointments a
    WHERE a.id = video_consultations.appointment_id
      AND (a.user_id = auth.uid() OR a.doctor_id = public.current_doctor_id())
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS video_consultations_appointment_id_key
  ON public.video_consultations (appointment_id);