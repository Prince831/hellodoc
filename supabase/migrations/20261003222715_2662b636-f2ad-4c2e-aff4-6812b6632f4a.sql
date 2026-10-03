-- 1. Tighten room updates
DROP POLICY IF EXISTS "Participants can update video rooms" ON public.video_consultations;
CREATE POLICY "Participants can update video rooms" ON public.video_consultations
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = video_consultations.appointment_id AND (a.user_id = auth.uid() OR a.doctor_id = public.current_doctor_id())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = video_consultations.appointment_id AND (a.user_id = auth.uid() OR a.doctor_id = public.current_doctor_id())));

CREATE OR REPLACE FUNCTION public.guard_video_room_identity()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.appointment_id IS DISTINCT FROM OLD.appointment_id OR NEW.room_id IS DISTINCT FROM OLD.room_id THEN
    RAISE EXCEPTION 'A consultation room cannot be moved or renamed';
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS video_room_identity_guard ON public.video_consultations;
CREATE TRIGGER video_room_identity_guard BEFORE UPDATE ON public.video_consultations
  FOR EACH ROW EXECUTE FUNCTION public.guard_video_room_identity();

-- 2. Participant helpers
CREATE OR REPLACE FUNCTION public.is_room_participant(_room_id text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE
    WHEN _room_id LIKE 'chat-%' THEN EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id::text = substring(_room_id from 6)
        AND (c.patient_id = auth.uid() OR c.doctor_id = public.current_doctor_id()))
    ELSE EXISTS (
      SELECT 1 FROM public.video_consultations v
      JOIN public.appointments a ON a.id = v.appointment_id
      WHERE v.room_id = _room_id
        AND (a.user_id = auth.uid() OR a.doctor_id = public.current_doctor_id()))
  END
$$;

CREATE OR REPLACE FUNCTION public.can_reach_user(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT _user_id = auth.uid()
    OR public.is_treating_doctor(_user_id)
    OR EXISTS (
      SELECT 1 FROM public.doctors d
      WHERE d.user_id = _user_id AND (
        EXISTS (SELECT 1 FROM public.appointments a WHERE a.doctor_id = d.id AND a.user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.conversations c WHERE c.doctor_id = d.id AND c.patient_id = auth.uid())))
$$;

REVOKE EXECUTE ON FUNCTION public.is_room_participant(text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.can_reach_user(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.is_room_participant(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_reach_user(uuid) TO authenticated;

-- 3. Private realtime channel authorization
CREATE OR REPLACE FUNCTION public.can_use_realtime_topic(_topic text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE
    WHEN _topic LIKE 'webrtc:%' THEN public.is_room_participant(substring(_topic from 8))
    WHEN _topic LIKE 'room-chat:%' THEN public.is_room_participant(substring(_topic from 11))
    WHEN _topic LIKE 'calls:%' THEN
      CASE WHEN substring(_topic from 7) ~ '^[0-9a-f-]{36}$'
           THEN public.can_reach_user(substring(_topic from 7)::uuid) ELSE false END
    ELSE false
  END
$$;
REVOKE EXECUTE ON FUNCTION public.can_use_realtime_topic(text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.can_use_realtime_topic(text) TO authenticated;

DROP POLICY IF EXISTS "Participants can receive room broadcasts" ON realtime.messages;
DROP POLICY IF EXISTS "Participants can send room broadcasts" ON realtime.messages;
CREATE POLICY "Participants can receive room broadcasts" ON realtime.messages
  FOR SELECT TO authenticated USING (public.can_use_realtime_topic((SELECT realtime.topic())));
CREATE POLICY "Participants can send room broadcasts" ON realtime.messages
  FOR INSERT TO authenticated WITH CHECK (public.can_use_realtime_topic((SELECT realtime.topic())));