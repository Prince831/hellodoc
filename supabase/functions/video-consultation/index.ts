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
    const { doctorId, patientId, action, data } = await req.json();

    if (!doctorId || !patientId || !action) {
      return new Response(JSON.stringify({ error: 'Missing doctorId, patientId, or action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // This is a placeholder for video consultation signaling logic.
    // Actions could be: "start_call", "end_call", "send_signal", etc.
    // Data could include SDP offers/answers, ICE candidates, etc.

    // For now, just log and return success.
    console.log(`Video consultation action: ${action} from doctor ${doctorId} to patient ${patientId}`, data);

    return new Response(JSON.stringify({ success: true, action, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
