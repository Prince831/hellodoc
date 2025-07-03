
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, doctorId, date, reason, notes } = await req.json();

    if (!userId || !doctorId || !date || !reason) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create appointment
    const { data: appointmentData, error: appointmentError } = await supabaseClient
      .from('appointments')
      .insert({
        user_id: userId,
        doctor_id: doctorId,
        date,
        reason,
        notes,
        status: 'pending'
      })
      .select()
      .single();

    if (appointmentError) {
      return new Response(JSON.stringify({ error: appointmentError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create notification for the user
    await supabaseClient
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Appointment Scheduled',
        message: `Your appointment for ${reason} has been scheduled and is pending confirmation.`,
        type: 'success',
        action_url: '/appointments',
      });

    return new Response(JSON.stringify({ success: true, appointment: appointmentData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
