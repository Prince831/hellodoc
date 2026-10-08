// Scheduled every 15 minutes. Sends in-app reminders at each person's chosen
// lead times (user_settings.reminder_offsets, in minutes) before upcoming
// appointments. Sent reminders are tracked per person in appointments.reminders_sent.
import { corsHeaders, serviceClient } from "../_shared/auth.ts";

const DEFAULT_OFFSETS = [1440, 60];
const MAX_LEAD_MIN = 7 * 24 * 60;

const label = (min: number) =>
  min >= 1440 ? `in ${Math.round(min / 1440)} day(s)` : min >= 60 ? `in ${Math.round(min / 60)} hour(s)` : `in ${min} minutes`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const db = serviceClient();
  const now = Date.now();
  let sent = 0;

  const { data: appts, error } = await db
    .from("appointments")
    .select("id, user_id, date, reason, reminders_sent, doctor:doctors(name, user_id)")
    .in("status", ["pending", "approved"])
    .gt("date", new Date(now).toISOString())
    .lte("date", new Date(now + MAX_LEAD_MIN * 60000).toISOString())
    .limit(500);
  if (error) {
    console.error("query failed", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }

  for (const a of appts ?? []) {
    const doctor = a.doctor as unknown as { name: string; user_id: string | null } | null;
    const recipients = [a.user_id, doctor?.user_id].filter(Boolean) as string[];
    const { data: prefs } = await db
      .from("user_settings")
      .select("user_id, appointment_reminders, reminder_offsets")
      .in("user_id", recipients);
    const prefMap = new Map((prefs ?? []).map((p) => [p.user_id, p]));
    const minutesLeft = (new Date(a.date).getTime() - now) / 60000;
    const record = { ...((a.reminders_sent as Record<string, number[]>) ?? {}) };
    const when = new Date(a.date).toUTCString().replace(":00 GMT", " UTC");
    const rows = [];

    for (const uid of recipients) {
      const p = prefMap.get(uid);
      if (p?.appointment_reminders === false) continue;
      const offsets: number[] = p?.reminder_offsets?.length ? p.reminder_offsets : DEFAULT_OFFSETS;
      const already = new Set(record[uid] ?? []);
      // Smallest due offset not yet sent (avoid a burst when several are due at once).
      const due = offsets.filter((o) => minutesLeft <= o && !already.has(o)).sort((x, y) => x - y);
      if (!due.length) continue;
      record[uid] = [...already, ...due];
      const isPatient = uid === a.user_id;
      rows.push({
        user_id: uid,
        title: isPatient ? "Appointment reminder" : "Upcoming appointment",
        message: isPatient
          ? `Your appointment with ${doctor?.name ?? "your doctor"} is ${label(due[0])} (${when}).`
          : `Appointment ${label(due[0])} (${when}): ${a.reason}`,
        type: "info",
        action_url: isPatient ? "/appointments" : "/doctor",
      });
    }
    if (!rows.length) continue;

    // Claim by comparing the previous record so overlapping runs never double-send.
    const { data: claimed } = await db
      .from("appointments")
      .update({ reminders_sent: record })
      .eq("id", a.id)
      .eq("reminders_sent", JSON.stringify(a.reminders_sent ?? {}))
      .select("id");
    if (!claimed?.length) continue;

    const { error: insertError } = await db.from("notifications").insert(rows);
    if (insertError) console.error("notify failed", insertError.message);
    else sent += rows.length;
  }

  return new Response(JSON.stringify({ sent }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
