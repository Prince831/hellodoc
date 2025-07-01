
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

    const { doctorId, content, subject } = await req.json();

    // Get the authenticated user
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if conversation exists
    let conversationId;
    const { data: existingConversation } = await supabaseClient
      .from('conversations')
      .select('id')
      .eq('patient_id', user.id)
      .eq('doctor_id', doctorId)
      .single();

    if (existingConversation) {
      conversationId = existingConversation.id;
    } else {
      // Create new conversation
      const { data: newConversation, error: convError } = await supabaseClient
        .from('conversations')
        .insert({
          patient_id: user.id,
          doctor_id: doctorId,
          subject: subject || 'New consultation'
        })
        .select('id')
        .single();

      if (convError) throw convError;
      conversationId = newConversation.id;
    }

    // Send message
    const { data: message, error: messageError } = await supabaseClient
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        receiver_id: doctorId,
        content: content
      })
      .select()
      .single();

    if (messageError) throw messageError;

    // Update conversation last message time
    await supabaseClient
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId);

    return new Response(JSON.stringify({ success: true, message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in send-message function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
