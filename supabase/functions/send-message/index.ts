import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, getAuthUserId, serviceClient, unauthorized, forbidden } from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const callerId = await getAuthUserId(req);
    if (!callerId) return unauthorized();

    const { senderId, receiverId, content, conversationId } = await req.json();

    if (!receiverId || !content) {
      return new Response(JSON.stringify({ error: 'Missing receiverId or content' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (senderId && senderId !== callerId) {
      return forbidden('You may only send messages as yourself');
    }

    const supabaseClient = serviceClient();

    const { data: messageData, error: messageError } = await supabaseClient
      .from('messages')
      .insert({
        sender_id: callerId,
        receiver_id: receiverId,
        content,
        conversation_id: conversationId,
        read: false,
      })
      .select()
      .single();

    if (messageError) {
      return new Response(JSON.stringify({ error: messageError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await supabaseClient
      .from('notifications')
      .insert({
        user_id: receiverId,
        title: 'New Message',
        message: `You have received a new message: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
        type: 'info',
        action_url: '/messages',
      });

    return new Response(JSON.stringify({ success: true, message: messageData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
