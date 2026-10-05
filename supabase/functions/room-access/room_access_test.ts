// Access-rule tests for consultation rooms.
// Creates a patient, a doctor, and an unrelated user, an appointment and its
// room, then checks who can view, update, move and join the room.
import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2";

const URL = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("VITE_SUPABASE_URL")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const admin = SERVICE ? createClient(URL, SERVICE, { auth: { persistSession: false } }) : null;
const stamp = crypto.randomUUID().slice(0, 8);
const password = `Test-${crypto.randomUUID()}`;

async function makeUser(label: string, role: "patient" | "doctor") {
  const email = `room-test-${label}-${stamp}@example.com`;
  const { data, error } = await admin!.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: `Test ${label}`, role },
  });
  if (error) throw error;
  const client = createClient(URL, ANON, { auth: { persistSession: false } });
  const { error: signInError } = await client.auth.signInWithPassword({ email, password });
  if (signInError) throw signInError;
  return { id: data.user.id, client };
}

async function canJoin(client: SupabaseClient, topic: string): Promise<boolean> {
  const { data } = await client.auth.getSession();
  await client.realtime.setAuth(data.session!.access_token);
  return await new Promise((resolve) => {
    const channel = client.channel(topic, { config: { private: true } });
    const timer = setTimeout(() => finish(false), 8000);
    function finish(ok: boolean) {
      clearTimeout(timer);
      client.removeChannel(channel);
      resolve(ok);
    }
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") finish(true);
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") finish(false);
    });
  });
}

Deno.test({
  name: "only the appointment's patient and doctor can access its consultation room",
  ignore: !SERVICE,
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async () => {
    const patient = await makeUser("patient", "patient");
    const doctorUser = await makeUser("doctor", "doctor");
    const outsider = await makeUser("outsider", "patient");
    const createdDoctorIds: string[] = [];

    try {
      const { data: doctor, error: doctorError } = await admin!
        .from("doctors")
        .insert({
          name: `Dr Test ${stamp}`,
          specialization: "General Practice",
          keywords: ["test"],
          years_of_experience: 1,
          rating: 0,
          user_id: doctorUser.id,
        })
        .select("id")
        .single();
      if (doctorError) throw doctorError;
      createdDoctorIds.push(doctor.id);

      const makeAppointment = async (offsetDays: number) => {
        const { data, error } = await admin!
          .from("appointments")
          .insert({
            user_id: patient.id,
            doctor_id: doctor.id,
            date: new Date(Date.now() + offsetDays * 86400000).toISOString(),
            status: "approved",
            reason: "Room access test",
          })
          .select("id")
          .single();
        if (error) throw error;
        return data.id as string;
      };
      const appointmentId = await makeAppointment(3);
      const otherAppointmentId = await makeAppointment(4);

      const roomId = `test-${stamp}`;
      const { error: roomError } = await admin!
        .from("video_consultations")
        .insert({ appointment_id: appointmentId, room_id: roomId, status: "scheduled" });
      if (roomError) throw roomError;

      // Viewing
      for (const [who, user] of [["patient", patient], ["doctor", doctorUser]] as const) {
        const { data } = await user.client.from("video_consultations").select("id").eq("room_id", roomId);
        assertEquals(data?.length, 1, `${who} should see the room`);
      }
      const { data: outsiderView } = await outsider.client
        .from("video_consultations").select("id").eq("room_id", roomId);
      assertEquals(outsiderView?.length ?? 0, 0, "outsider must not see the room");

      // Updating
      const { data: patientUpdate } = await patient.client
        .from("video_consultations").update({ status: "active" }).eq("room_id", roomId).select("id");
      assertEquals(patientUpdate?.length, 1, "patient should update the room");

      const { data: doctorUpdate } = await doctorUser.client
        .from("video_consultations").update({ status: "scheduled" }).eq("room_id", roomId).select("id");
      assertEquals(doctorUpdate?.length, 1, "doctor should update the room");

      const { data: outsiderUpdate } = await outsider.client
        .from("video_consultations").update({ status: "ended" }).eq("room_id", roomId).select("id");
      assertEquals(outsiderUpdate?.length ?? 0, 0, "outsider must not update the room");

      // Moving the room to another appointment
      const { error: moveError } = await patient.client
        .from("video_consultations").update({ appointment_id: otherAppointmentId }).eq("room_id", roomId);
      assert(moveError, "moving a room to another appointment must fail");

      // Creating a room for someone else's appointment
      const { error: outsiderInsert } = await outsider.client
        .from("video_consultations")
        .insert({ appointment_id: otherAppointmentId, room_id: `intruder-${stamp}` });
      assert(outsiderInsert, "outsider must not create a room for another appointment");

      // Private realtime channels
      assert(await canJoin(patient.client, `webrtc:${roomId}`), "patient should join the call channel");
      assert(await canJoin(doctorUser.client, `webrtc:${roomId}`), "doctor should join the call channel");
      assertEquals(await canJoin(outsider.client, `webrtc:${roomId}`), false, "outsider must not join the call channel");
      assertEquals(await canJoin(outsider.client, `room-chat:${roomId}`), false, "outsider must not join the room chat");
      assertEquals(await canJoin(outsider.client, `calls:${doctorUser.id}`), false, "outsider must not ring the doctor");
    } finally {
      await admin!.from("video_consultations").delete().like("room_id", `%${stamp}`);
      await admin!.from("appointments").delete().eq("user_id", patient.id);
      if (createdDoctorIds.length) await admin!.from("doctors").delete().in("id", createdDoctorIds);
      for (const u of [patient, doctorUser, outsider]) await admin!.auth.admin.deleteUser(u.id);
    }
  },
});
