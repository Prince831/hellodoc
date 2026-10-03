# Rooms access, live booking, and AI visit prep

## 1. Consultation room access (verify, fix, test)

What the database shows today:
- Viewing, creating and updating a room is limited to the appointment's patient or doctor.
- The update rule has no check on the result, so a participant could move a room onto a different appointment.
- Live call signalling runs over open Realtime channels named after the room, and nothing checks who joins.
- Room deletion is blocked for everyone, which is fine.

Fixes:
- Update rule: add the same participant check on the result, and stop anyone changing `appointment_id` or `room_id` after the room is created.
- Use private Realtime channels for call signalling and in-call chat. Add rules on `realtime.messages` so only the patient and doctor of the appointment that owns the room can join.
- The `/call/:roomId` page shows a clear "not your consultation" screen instead of trying to connect.

Tests (Deno, run with the edge-function test runner):
- Create a patient, the doctor, and an unrelated user, plus an appointment and its room, using the service key.
- Check that the patient and doctor can view and update the room.
- Check that the unrelated user cannot view, create or update it, cannot move it to another appointment, and cannot join its private channel.
- Remove all test data afterwards.

## 2. Real-time booking

- **Available times:** built from the doctor's weekly schedule, minus breaks, time off and already-booked appointments. A secure database function returns only the free times, so other patients' bookings and the doctor's private time-off reasons stay hidden. The list updates live when someone else books.
- **No double booking:** a unique rule on doctor + start time (cancelled appointments don't count). Booking goes through the existing `book-appointment` function, which re-checks the time is still free.
- **Confirmation:** after booking, a confirmation screen and an in-app notification for both patient and doctor. The doctor can accept or decline, and the patient gets notified.
- **Rescheduling:** the patient or doctor picks a new free time. The old time is released, the consultation room stays the same, and both sides are notified. Cancelling works the same way.
- **Reminders:** a scheduled function runs every 15 minutes and sends in-app reminders 24 hours and 1 hour before each appointment. It respects each person's "Appointment reminders" setting and won't send the same reminder twice.

## 3. AI visit prep

- On the booking page and the symptom checker, patients describe their symptoms in their own words.
- The AI suggests a consultation type (video, voice, in-person, or urgent care), with a short reason. It also drafts a short note for the doctor: main complaint, how long, severity, relevant history and questions. The patient can edit the note before it's attached to the booking.
- Emergency warning signs always show an urgent-care warning, and the patient can't book until they've seen it.
- The note is stored with the appointment and shown to the doctor on their dashboard and on the patient's chart.
- Rate-limit, credit and refusal errors show a clear message. Booking still works without the AI.

## Technical details

- Migration: fix the `video_consultations` update `WITH CHECK` and add a trigger that blocks changes to `appointment_id`/`room_id`. Add RLS on `realtime.messages` keyed on topic `room:<room_id>` through a security-definer `is_room_participant(room_id)`. Switch `useWebRTC`, `useRoomChat` and `useCallSignaling` to `{ config: { private: true } }`.
- Migration: `get_available_slots(doctor_id, date)` (security definer, returns times only). Partial unique index on `appointments(doctor_id, date)` where status is not cancelled. New columns `appointments.consultation_type`, `ai_visit_note`, `reminder_24h_sent_at`, `reminder_1h_sent_at`. Add `appointments` to the Realtime publication so slots refresh live.
- `book-appointment` gains reschedule and cancel actions, validates input with Zod, and checks the caller is the patient or the doctor.
- New `appointment-reminders` edge function, scheduled with pg_cron and pg_net using the project URL and publishable key. Inside, it uses the service role and checks `user_settings.appointment_reminders`.
- New `visit-prep` edge function. It checks the caller's sign-in and uses the AI SDK with Lovable AI Gateway Responses, model `openai/gpt-6-astra` with reasoning set to low, streamed with structured output (consultation_type, reason, red_flags, doctor_note). It returns errors with their original status (402, 403, 429). `LOVABLE_API_KEY` is already set.
- Tests live in `supabase/functions/room-access/room_access_test.ts`. The test needs `SUPABASE_SERVICE_ROLE_KEY` available to the runner, and that secret is already stored.
