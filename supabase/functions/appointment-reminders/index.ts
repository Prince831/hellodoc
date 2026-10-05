// Scheduled every 15 minutes. Sends in-app reminders 24h and 1h before
// upcoming appointments, once each, respecting each person's settings.
import { corsHeaders, serviceClient } from "../_shared/auth.ts";

type Window = { column: "reminder_24h_sent_at" | "reminder_1h_sent_at"; fromMin: number; toMin: number; label: string };

const WINDOWS: Window[] = [
  { column: "reminder_24h_sent_at", fromMin: 60, toMin: 24 * 60, label: "tomorrow" },
  { column: "reminder_1h_sent_at", fromMin: 0, toMin: 60, label: "within the hour" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const db = serviceClient();
  const now = Date.now();
  let sent = 0;

  for (const w of WINDOWS) {
    const { data: appts, error } = await db
      .from("appointments")
      .select("id, user_id, date, reason, doctor:doctors(name, user_id)")
      .in("status", ["pending", "approved"])
      .is(w.column, null)
      .gt("date", new Date(now + w.fromMin * 60000).toISOString())
      .lte("date", new Date(now + w.toMin * 60000).toISOString())
      .limit(200);
    if (error) {
      console.error("query failed", error.message);
      continue;
    }

    for (const a of appts ?? []) {
      const doctor = a.doctor as unknown as { name: string; user_id: string | null } | null;
      // Claim the reminder first so overlapping runs never double-send.
      const { data: claimed } = await db
        .from("appointments")
        .update({ [w.column]: new Date().toISOString() })
        .eq("id", a.id)
        .is(w.column, null)
        .select("id");
      if (!claimed?.length) continue;

      const recipients = [a.user_id, doctor?.user_id].filter(Boolean) as string[];
      const { data: prefs } = await db
        .from("user_settings")
        .select("user_id, appointment_reminders")
        .in("user_id", recipients);
      const optedOut = new Set((prefs ?? []).filter((p) => p.appointment_reminders === false).map((p) => p.user_id));

      const when = new Date(a.date).toUTCString().replace(":00 GMT", " UTC");
      const rows = [];
      if (!optedOut.has(a.user_id)) {
        rows.push({
          user_id: a.user_id,
          title: "Appointment reminder",
          message: `Your appointment with ${doctor?.name ?? "your doctor"} is ${w.label} (${when}).`,
          type: "info",
          action_url: "/appointments",
        });
      }
      if (doctor?.user_id && !optedOut.has(doctor.user_id)) {
        rows.push({
          user_id: doctor.user_id,
          title: "Upcoming appointment",
          message: `Appointment ${w.label} (${when}): ${a.reason}`,
          type: "info",
          action_url: "/doctor",
        });
      }
      if (rows.length) {
        const { error: insertError } = await db.from("notifications").insert(rows);
        if (insertError) console.error("notify failed", insertError.message);
        else sent += rows.length;
      }
    }
  }

  return new Response(JSON.stringify({ sent }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
