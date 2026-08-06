import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, getAuthUserId, serviceClient, unauthorized, forbidden } from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const callerId = await getAuthUserId(req);
    if (!callerId) return unauthorized();

    const { userId, title, message, type = 'info', actionUrl } = await req.json();

    if (!userId || !title || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = serviceClient();

    if (userId !== callerId) {
      // Only a doctor treating this patient may notify someone else.
      const { data: doctor } = await supabaseClient
        .from('doctors')
        .select('id')
        .eq('user_id', callerId)
        .maybeSingle();

      if (!doctor) return forbidden('You may only create notifications for yourself');

      const { data: appointment } = await supabaseClient
        .from('appointments')
        .select('id')
        .eq('doctor_id', doctor.id)
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle();

      if (!appointment) return forbidden('Not a treating doctor for this patient');
    }

    const { data, error } = await supabaseClient
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        action_url: actionUrl,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, notification: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
