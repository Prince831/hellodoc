
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
    const body = await req.json();
    const { userId, doctorId, date, reason, notes } = body;

    // Input validation
    if (!userId || typeof userId !== 'string') {
      return new Response(JSON.stringify({ error: 'Valid user ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!doctorId || typeof doctorId !== 'string') {
      return new Response(JSON.stringify({ error: 'Valid doctor ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!date || typeof date !== 'string' || isNaN(Date.parse(date))) {
      return new Response(JSON.stringify({ error: 'Valid appointment date is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Appointment reason is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (reason.length > 500) {
      return new Response(JSON.stringify({ error: 'Appointment reason is too long (max 500 characters)' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (notes && typeof notes !== 'string') {
      return new Response(JSON.stringify({ error: 'Notes must be a string if provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (notes && notes.length > 1000) {
      return new Response(JSON.stringify({ error: 'Notes are too long (max 1000 characters)' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sanitize inputs
    const sanitizedReason = reason.trim().replace(/[<>]/g, '');
    const sanitizedNotes = notes ? notes.trim().replace(/[<>]/g, '') : null;

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
        reason: sanitizedReason,
        notes: sanitizedNotes,
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
        message: `Your appointment for ${sanitizedReason} has been scheduled and is pending confirmation.`,
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
