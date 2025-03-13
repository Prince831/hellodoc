
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, userId } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log("Processing symptoms:", symptoms);

    // Create Supabase client for database operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Call OpenAI API to analyze symptoms
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a medical pre-screening assistant. Analyze the symptoms and provide:
            1. A brief analysis of the symptoms
            2. Recommend one of these actions: "self_care", "virtual_consultation", or "emergency"
            3. Provide specific recommendations based on the symptoms
            4. Extract key medical terms or keywords from the symptoms that could help match with specialist doctors
            Format your response as JSON with these fields:
            {
              "analysis": "brief analysis",
              "recommendedAction": "one of the three actions",
              "recommendations": "specific recommendations",
              "keywords": ["keyword1", "keyword2", "..."]
            }`
          },
          { role: 'user', content: symptoms }
        ],
      }),
    });

    const aiResponse = await response.json();
    console.log("API response received:", JSON.stringify(aiResponse));
    
    // Fix for the "Cannot read properties of undefined (reading '0')" error
    if (!aiResponse.choices || !aiResponse.choices[0]) {
      console.error('Unexpected API response:', JSON.stringify(aiResponse));
      throw new Error('Invalid response from OpenAI API');
    }

    const content = aiResponse.choices[0].message.content;
    let aiOutput;
    
    try {
      aiOutput = JSON.parse(content);
      console.log("Parsed AI output:", JSON.stringify(aiOutput));
    } catch (error) {
      console.error('Error parsing AI response as JSON:', content);
      // Fallback with basic structure if parsing fails
      aiOutput = {
        analysis: "Unable to analyze symptoms properly. Please consult with a healthcare professional.",
        recommendedAction: "virtual_consultation",
        recommendations: "Schedule a consultation with a doctor to discuss your symptoms.",
        keywords: symptoms.toLowerCase().split(' ')
      };
    }

    // Extract keywords for doctor matching
    const keywords = aiOutput.keywords || 
      symptoms.toLowerCase().split(/\s+/).filter((word: string) => word.length > 3);
    
    console.log("Extracted keywords for doctor matching:", keywords);

    // Find doctors that match the keywords
    const { data: matchedDoctors, error: doctorsError } = await supabaseClient
      .from('doctors')
      .select('*')
      .filter('keywords', 'cs', `{${keywords.join(',')}}`);
      
    if (doctorsError) {
      console.error("Error fetching matching doctors:", doctorsError);
    } else {
      console.log(`Found ${matchedDoctors?.length || 0} matching doctors`);
    }

    // Store the result in the database if userId is provided
    if (userId) {
      console.log("Storing symptom check for user:", userId);
      
      const { error: dbError } = await supabaseClient
        .from('symptom_checks')
        .insert({
          user_id: userId,
          symptoms,
          ai_recommendation: aiOutput.recommendations,
          recommended_action: aiOutput.recommendedAction,
        });

      if (dbError) {
        console.error('Database error:', dbError);
      }
    }

    // Include matched doctors in the response
    return new Response(JSON.stringify({
      ...aiOutput,
      matchedDoctors: matchedDoctors || []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      analysis: "An error occurred during analysis. Please try again later.",
      recommendedAction: "virtual_consultation",
      recommendations: "Please consult with a healthcare professional.",
      matchedDoctors: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
