CREATE OR REPLACE FUNCTION public.get_available_slots(_doctor_id uuid, _day date, _slot_minutes integer DEFAULT 30)
RETURNS TABLE (slot_start timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  s record;
  t time;
  has_schedule boolean;
BEGIN
  IF auth.uid() IS NULL THEN RETURN; END IF;
  IF _slot_minutes < 10 OR _slot_minutes > 240 THEN _slot_minutes := 30; END IF;

  IF EXISTS (SELECT 1 FROM public.doctor_unavailability u
             WHERE u.doctor_id = _doctor_id AND _day BETWEEN u.start_date AND u.end_date) THEN
    RETURN;
  END IF;

  SELECT EXISTS (SELECT 1 FROM public.doctor_schedules WHERE doctor_id = _doctor_id) INTO has_schedule;

  FOR s IN
    SELECT ds.start_time, ds.end_time, ds.break_start_time, ds.break_end_time
    FROM public.doctor_schedules ds
    WHERE has_schedule AND ds.doctor_id = _doctor_id
      AND ds.day_of_week = EXTRACT(DOW FROM _day)::int
      AND COALESCE(ds.is_available, true)
    UNION ALL
    SELECT time '09:00', time '17:00', time '12:00', time '13:00'
    WHERE NOT has_schedule AND EXTRACT(DOW FROM _day)::int BETWEEN 1 AND 5
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