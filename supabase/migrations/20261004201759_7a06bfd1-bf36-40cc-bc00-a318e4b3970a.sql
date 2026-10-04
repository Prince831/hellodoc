ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS consultation_type text,
  ADD COLUMN IF NOT EXISTS ai_visit_note text,
  ADD COLUMN IF NOT EXISTS reminder_24h_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS reminder_1h_sent_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS appointments_doctor_slot_unique
  ON public.appointments (doctor_id, date)
  WHERE status NOT IN ('cancelled', 'declined');

CREATE OR REPLACE FUNCTION public.get_available_slots(_doctor_id uuid, _day date, _slot_minutes integer DEFAULT 30)
RETURNS TABLE (slot_start timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  s record;
  t time;
BEGIN
  IF auth.uid() IS NULL THEN RETURN; END IF;
  IF _slot_minutes < 10 OR _slot_minutes > 240 THEN _slot_minutes := 30; END IF;

  IF EXISTS (SELECT 1 FROM public.doctor_unavailability u
             WHERE u.doctor_id = _doctor_id AND _day BETWEEN u.start_date AND u.end_date) THEN
    RETURN;
  END IF;

  FOR s IN
    SELECT * FROM public.doctor_schedules ds
    WHERE ds.doctor_id = _doctor_id
      AND ds.day_of_week = EXTRACT(DOW FROM _day)::int
      AND COALESCE(ds.is_available, true)
  LOOP
    t := s.start_time;
    WHILE t + make_interval(mins => _slot_minutes) <= s.end_time LOOP
      IF NOT (s.break_start_time IS NOT NULL AND s.break_end_time IS NOT NULL
              AND t < s.break_end_time AND t + make_interval(mins => _slot_minutes) > s.break_start_time) THEN
        slot_start := (_day + t) AT TIME ZONE 'UTC';
        IF slot_start > now()
           AND NOT EXISTS (SELECT 1 FROM public.appointments a
                           WHERE a.doctor_id = _doctor_id AND a.date = slot_start
                             AND a.status NOT IN ('cancelled', 'declined')) THEN
          RETURN NEXT;
        END IF;
      END IF;
      t := t + make_interval(mins => _slot_minutes);
    END LOOP;
  END LOOP;
END; $$;

REVOKE EXECUTE ON FUNCTION public.get_available_slots(uuid, date, integer) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_available_slots(uuid, date, integer) TO authenticated;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;