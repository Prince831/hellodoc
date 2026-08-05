# HelloDoc: Full Overhaul — Auth, Real Data, Doctor Portal, AI

## What's broken today (verified)

- **No authentication anywhere.** Every route is public and `App.tsx` has no session handling.
- **Hardcoded `'demo-user'` ID** in `useAppointments`, `useMessages`, `useNotifications`, `useNotificationTriggers`, `Messages`, `HealthRecords`. It isn't even a valid UUID, so appointments, messages, medications, records and notifications silently return nothing — every RLS policy compares against `auth.uid()`.
- **Roles live on `profiles.role`,** and `has_role()` reads that column. A user who can update their own profile can make themselves an admin. Roles must move to a dedicated table.
- **Doctors are not users.** The `doctors` table has no link to an account, so doctors cannot sign in or see their own appointments/messages.
- **Symptom checker uses a raw OpenAI key** and matches against four hardcoded mock doctors instead of the real directory.
- **Auto-seeding on every app start** (`useInitializeApp`) blocks the whole app behind a splash screen and writes to the database from the browser.
- **Missing policies:** no delete on appointment notes/messages/conversations, no insert path for notifications from the client, doctors can't read patient data they treat.
- **Video consultation is a mock UI** with no signalling or persisted rooms.

## Plan

### 1. Database and security foundation
- `user_roles` table + `app_role` enum (`patient`, `doctor`, `admin`), with a security-definer `has_role()` reading from it. Rewrite every policy that depends on roles; remove reliance on `profiles.role`.
- Add `user_id` to `doctors`, linking each doctor record to an account; backfill/seed accordingly.
- New policies so doctors can read and write the records of patients they have appointments or conversations with (appointments, notes, lab results, vitals, medications, health records).
- Signup trigger creates the profile and assigns the chosen role.
- Grants reviewed for every table.

### 2. Authentication
- `/auth` page with sign-up (patient or doctor), sign-in, and a `/reset-password` page.
- Session provider with `onAuthStateChange` + `getUser()`, protected routes, role-aware redirects (patients to `/dashboard`, doctors to `/doctor`).
- Header shows the signed-in user with sign-out.
- Auto-confirm email on so signup logs users straight in (no mail server configured).

### 3. Replace demo data wiring
- Every hook and page switches from `'demo-user'` to the authenticated user's ID.
- Remove the browser-side auto-seed; seed doctors once via a database migration instead, and drop the blocking splash screen.
- Consistent loading, empty and error states across appointments, messages, medications, records, notifications.

### 4. Doctor portal
- `/doctor` dashboard: today's schedule, pending requests, unread messages, patient list.
- Approve / decline / reschedule / complete appointments, with a notification to the patient.
- Patient chart view: history, medications, lab results, vitals, and clinical notes the doctor can add.
- Availability editor writing to `doctor_schedules` and `doctor_unavailability`; the patient booking flow reads real availability and blocks already-booked slots.
- Doctor profile editor.

### 5. AI symptom checker
- Move off the OpenAI key to the Lovable AI Gateway (`google/gemini-3.6-flash`) in a rewritten `analyze-symptoms` function.
- Match against real doctors from the database by specialization keywords instead of the mock list.
- Save every check to `symptom_checks` for the signed-in user, with history shown in the dashboard.
- Handle rate-limit (429) and credit (402) errors visibly.

### 6. New features
- **Real video consultations:** WebRTC peer connection with signalling over Supabase Realtime, rooms persisted in `video_consultations`, join links from appointments, mute/camera/end controls, call status tracking.
- **Appointment reminders:** scheduled function that creates notifications ahead of upcoming appointments.
- **File uploads:** private storage bucket for lab reports and record attachments, with owner-and-treating-doctor access.
- **Prescriptions:** doctors issue medications to patients; patients see them in Medications with refill counts.

### 7. Polish
- Real-time subscriptions cleaned up in `useEffect` teardown to stop duplicate channels.
- Zod validation on every form, both client and edge-function side.
- Mobile responsiveness pass, keyboard/focus states, and semantic tokens instead of any hardcoded colors.
- Page-level SEO metadata, single H1 per page, alt text, canonical tags.

## Technical notes

- Sequence: migrations first (roles, doctor linkage, policies, seed), then auth, then hook rewiring, then doctor portal, then AI and new features.
- `src/integrations/supabase/types.ts` regenerates from migrations; it is never hand-edited.
- `OPENAI_API_KEY` becomes unused once the symptom checker moves to the Lovable AI Gateway; it can stay stored or be removed later.
- Doctor sign-up creates a `doctors` row linked to the account, pending admin verification before appearing publicly in the directory.
