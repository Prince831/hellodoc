import { z } from "npm:zod@3.23.8";
import { corsHeaders, getAuthUserId, serviceClient, unauthorized, forbidden } from "../_shared/auth.ts";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const clean = (s: string) => s.trim().replace(/[<>]/g, "");

const Book = z.object({
  action: z.literal("book").default("book"),
  doctorId: z.string().uuid(),
  date: z.string().datetime({ offset: true }),
  reason: z.string().trim().min(1).max(500),
  notes: z.string().max(1000).optional().nullable(),
  consultationType: z.enum(["video", "voice", "in_person", "urgent_care"]).optional().nullable(),
  aiVisitNote: z.string().max(3000).optional().nullable(),
});
const Reschedule = z.object({
  action: z.literal("reschedule"),
  appointmentId: z.string().uuid(),
  date: z.string().datetime({ offset: true }),
});
const Cancel = z.object({ action: z.literal("cancel"), appointmentId: z.string().uuid() });
const Respond = z.object({
  action: z.literal("respond"),
  appointmentId: z.string().uuid(),
  decision: z.enum(["approved", "declined", "completed"]),
});
const Body = z.union([Reschedule, Cancel, Respond, Book]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const callerId = await getAuthUserId(req);
    if (!callerId) return unauthorized();

    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
    const input = parsed.data;
    const db = serviceClient();

    const isSlotFree = async (doctorId: string, date: string, ignoreId?: string) => {
      if (new Date(date).getTime() <= Date.now()) return false;
      let q = db.from("appointments").select("id").eq("doctor_id", doctorId).eq("date", date)
        .not("status", "in", "(cancelled,declined)");
      if (ignoreId) q = q.neq("id", ignoreId);
      const { data } = await q;
      return (data ?? []).length === 0;
    };

    const doctorUserId = async (doctorId: string) => {
      const { data } = await db.from("doctors").select("user_id, name").eq("id", doctorId).maybeSingle();
      return data as { user_id: string | null; name: string } | null;
    };

    const notify = async (userId: string | null | undefined, title: string, message: string, url: string) => {
      if (!userId) return;
      await db.from("notifications").insert({ user_id: userId, title, message, type: "info", action_url: url });
    };

    const when = (iso: string) =>
      new Date(iso).toUTCString().replace(":00 GMT", " UTC");

    if (input.action === "book") {
      if (!(await isSlotFree(input.doctorId, input.date))) {
        return json({ error: "That time has just been taken. Please pick another." }, 409);
      }
      const { data, error } = await db.from("appointments").insert({
        user_id: callerId,
        doctor_id: input.doctorId,
        date: input.date,
        reason: clean(input.reason),
        notes: input.notes ? clean(input.notes) : null,
        consultation_type: input.consultationType ?? null,
        ai_visit_note: input.aiVisitNote ? clean(input.aiVisitNote) : null,
        status: "pending",
      }).select().single();
      if (error) {
        if (error.code === "23505") return json({ error: "That time has just been taken. Please pick another." }, 409);
        return json({ error: error.message }, 500);
      }
      const doctor = await doctorUserId(input.doctorId);
      await notify(callerId, "Booking received", `Your appointment with ${doctor?.name ?? "your doctor"} on ${when(input.date)} is waiting for confirmation.`, "/appointments");
      await notify(doctor?.user_id, "New appointment request", `A patient requested ${when(input.date)}: ${clean(input.reason)}`, "/doctor");
      return json({ success: true, appointment: data });
    }

    // Actions on an existing appointment
    const { data: appt } = await db.from("appointments")
      .select("id, user_id, doctor_id, date, status").eq("id", input.appointmentId).maybeSingle();
    if (!appt) return json({ error: "Appointment not found" }, 404);
    const doctor = await doctorUserId(appt.doctor_id);
    const isPatient = appt.user_id === callerId;
    const isDoctor = !!doctor?.user_id && doctor.user_id === callerId;
    if (!isPatient && !isDoctor) return forbidden("You are not part of this appointment");
    const other = isPatient ? doctor?.user_id : appt.user_id;
    const otherUrl = isPatient ? "/doctor" : "/appointments";

    if (["cancelled", "declined", "completed"].includes(appt.status)) {
      return json({ error: `This appointment is already ${appt.status}.` }, 409);
    }

    if (input.action === "reschedule") {
      if (!(await isSlotFree(appt.doctor_id, input.date, appt.id))) {
        return json({ error: "That time is not available. Please pick another." }, 409);
      }
      const { error } = await db.from("appointments").update({
        date: input.date,
        status: isDoctor ? "approved" : "pending",
        reminder_24h_sent_at: null,
        reminder_1h_sent_at: null,
      }).eq("id", appt.id);
      if (error) {
        if (error.code === "23505") return json({ error: "That time has just been taken." }, 409);
        return json({ error: error.message }, 500);
      }
      await notify(other, "Appointment rescheduled", `Moved from ${when(appt.date)} to ${when(input.date)}.`, otherUrl);
      await notify(callerId, "Reschedule saved", `Your appointment is now on ${when(input.date)}.`, isPatient ? "/appointments" : "/doctor");
      return json({ success: true });
    }

    if (input.action === "cancel") {
      const { error } = await db.from("appointments").update({ status: "cancelled" }).eq("id", appt.id);
      if (error) return json({ error: error.message }, 500);
      await notify(other, "Appointment cancelled", `The appointment on ${when(appt.date)} was cancelled.`, otherUrl);
      return json({ success: true });
    }

    // respond — doctor only
    if (!isDoctor) return forbidden("Only the doctor can confirm or decline");
    const { error } = await db.from("appointments").update({ status: input.decision }).eq("id", appt.id);
    if (error) return json({ error: error.message }, 500);
    const label = { approved: "approved", declined: "declined", completed: "marked as completed" }[input.decision];
    await notify(appt.user_id, `Appointment ${label}`, `Your appointment on ${when(appt.date)} was ${label}.`, "/appointments");
    return json({ success: true });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unexpected error" }, 500);
  }
});
