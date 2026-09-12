# HelloDoc: Finish the App End to End

A single plan covering every remaining gap, from a first-time visitor's landing page through booking, consultation, records, and follow-up. Each future build implements the phases below in order.

## Verified gaps today

- Medications page shows four hardcoded sample drugs and treats the user as signed out; nothing is read from or written to the real medication records.
- Settings only pretends to save — a timer and a success toast, no stored preferences.
- Appointments page has no booking confirmation, reminder, or cancellation flow tied to real doctor availability checks end to end.
- No file uploads anywhere (no storage bucket), so lab reports and record attachments cannot be added.
- No prescription flow: doctors cannot issue medication to a patient.
- No appointment reminders.
- Several Three.js features from the agreed list are still unbuilt: appointment timeline, immersive consultation background, specialty galaxy, splash loader, bloom/glow pass.
- Health records page reads real data but has no add/edit path and no per-record detail view.

## Phase 1 — Real medications and prescriptions

- Medications page reads the signed-in patient's real medications, with loading, empty and error states, active/past split, and prescriber name.
- Patients can add self-reported medications; doctors can prescribe from a patient's chart (quantity, refills, instructions), which creates the medication plus a prescription record and notifies the patient.
- Refill request button on each prescribed medication, which messages the prescribing doctor and creates a notification.
- Interaction network keeps working, now fed by real medications.

## Phase 2 — Settings and profile that persist

- Account, notification, privacy and appearance preferences saved per user and restored on load.
- Notification preferences actually gate which notifications get created.
- Profile page writes to the real profile, including emergency contact, allergies, blood type and insurance.

## Phase 3 — Booking flow completed

- Availability comes from the doctor's schedule and unavailability, with already-booked slots blocked.
- Booking confirmation screen, patient and doctor notifications, and an appointment detail page.
- Patients can reschedule or cancel; doctors can approve, decline, reschedule or complete, each notifying the other side.
- Appointment reminders created ahead of time by a scheduled job.

## Phase 4 — Records, labs, vitals, attachments

- Private file storage for lab reports and record attachments, readable only by the owner and the treating doctor.
- Health record detail view; doctors can add diagnoses, notes and lab results from the patient chart.
- Lab results with reference ranges and trend charts; vitals history charts alongside the existing tracker.

## Phase 5 — Consultation and messaging finish

- In-chat file attachments (currently non-functional) wired to storage.
- Consultation summary after each call: duration, notes, follow-up action, saved to the appointment.
- Post-call state in the room list, and a consultation history page for both roles.
- Message read receipts and unread counts consistent across navbar, list and dashboard.

## Phase 6 — Remaining 3D and motion work

- 3D appointment timeline on the appointments page.
- Immersive depth background inside the consultation room (kept light so it never competes with video).
- Specialty galaxy on the doctor directory for browsing by specialization.
- Biological splash loader on first load.
- Subtle bloom/glow pass across hero scenes, with a reduced-motion and low-power fallback.

## Phase 7 — Hardening and polish

- Access rules reviewed for every new table, bucket and function; doctors only ever reach patients they treat.
- Input validation on every form and every server function.
- Empty, loading, error and offline states on all pages; mobile pass; keyboard and focus states.
- Page titles, descriptions, single H1, alt text, canonical tags across all pages.

## Technical notes

- New database work: medication/prescription grants and doctor-prescribe policies, user settings table, appointment status transitions, consultation summaries, storage bucket plus object policies, reminder scheduling.
- Storage bucket is private; access via signed URLs, owner and treating-doctor policies only.
- Reminders run as a scheduled edge function writing into notifications.
- Post-processing bloom is gated behind a capability check and `prefers-reduced-motion`.
- Order matters: Phase 1-3 unblock most of the product; 4-5 depend on the storage bucket; 6-7 land last.
