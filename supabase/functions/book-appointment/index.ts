
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { doctorId, date, reason, notes, isVideoConsultation } = await req.json();

    // Get the authenticated user
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Create appointment
    const { data: appointment, error: appointmentError } = await supabaseClient
      .from('appointments')
      .insert({
        user_id: user.id,
        doctor_id: doctorId,
        date: date,
        reason: reason,
        notes: notes,
        status: 'pending'
      })
      .select()
      .single();

    if (appointmentError) throw appointmentError;

    // If it's a video consultation, create video consultation record
    if (isVideoConsultation) {
      const roomId = `room_${appointment.id}_${Date.now()}`;
      
      const { error: videoError } = await supabaseClient
        .from('video_consultations')
        .insert({
          appointment_id: appointment.id,
          room_id: roomId,
          status: 'scheduled'
        });

      if (videoError) throw videoError;
    }

    // Create notification for the patient
    await supabaseClient
      .from('notifications')
      .insert({
        user_id: user.id,
        title: 'Appointment Booked',
        message: `Your appointment has been scheduled for ${new Date(date).toLocaleDateString()}`,
        type: 'success',
        action_url: '/appointments'
      });

    return new Response(JSON.stringify({ success: true, appointment }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in book-appointment function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
