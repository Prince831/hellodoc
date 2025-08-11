
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
    const body = await req.json();
    const { symptoms, userId } = body;
    
    // Input validation
    if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length === 0) {
      throw new Error('Symptoms are required and must be a non-empty string');
    }
    
    if (symptoms.length > 2000) {
      throw new Error('Symptoms description is too long (max 2000 characters)');
    }
    
    if (userId && typeof userId !== 'string') {
      throw new Error('User ID must be a valid string');
    }
    
    // Sanitize input
    const sanitizedSymptoms = symptoms.trim().replace(/[<>]/g, '');
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log("Processing symptoms:", sanitizedSymptoms);

    // Create Supabase client for database operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // First, let's directly query for doctors based on the symptoms text
    // This is a fallback in case the AI analysis fails
    const lowercaseSymptoms = sanitizedSymptoms.toLowerCase();
    const symptomWords = lowercaseSymptoms
      .split(/\s+|,/)
      .map(word => word.trim())
      .filter(word => word.length > 3);
    
    console.log("Extracted keyword candidates:", symptomWords);
    
    // Use mock doctors data since we removed the doctors table
    const mockDoctors = [
      { id: 'd1', name: 'Dr. Sarah Johnson', specialization: 'Cardiology', keywords: ['heart', 'chest', 'cardiac', 'blood pressure'], rating: 4.8 },
      { id: 'd2', name: 'Dr. Michael Chen', specialization: 'Neurology', keywords: ['headache', 'migraine', 'neurological', 'brain'], rating: 4.9 },
      { id: 'd3', name: 'Dr. Emily Watson', specialization: 'Dermatology', keywords: ['skin', 'rash', 'dermal', 'acne'], rating: 4.7 },
      { id: 'd4', name: 'Dr. James Wilson', specialization: 'General Medicine', keywords: ['fever', 'cold', 'flu', 'general'], rating: 4.6 }
    ];
    
    // Find doctors that match symptoms
    const directMatchDoctors = mockDoctors.filter(doctor => 
      doctor.keywords.some(keyword => 
        symptomWords.some(symptom => symptom.toLowerCase().includes(keyword.toLowerCase()))
      )
    );
    
    console.log(`Found ${directMatchDoctors.length} doctors through direct matching`);

    // Call OpenAI API to analyze symptoms
    try {
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
            { role: 'user', content: sanitizedSymptoms }
          ],
        }),
      });

      const aiResponse = await response.json();
      console.log("API response received:", JSON.stringify(aiResponse));
      
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
          keywords: symptomWords
        };
      }

      // Extract keywords for doctor matching
      const keywords = aiOutput.keywords || symptomWords;
      
      console.log("Extracted keywords for doctor matching:", keywords);

      // Find doctors that match the AI keywords using mock data
      const matchedDoctors = mockDoctors.filter(doctor => 
        keywords.some(keyword => 
          doctor.keywords.some(docKeyword => 
            docKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(docKeyword.toLowerCase())
          )
        )
      );
      
      console.log(`Found ${matchedDoctors.length} matching doctors`);

      // If AI matching found no doctors, use the direct match results
      const finalDoctors = (matchedDoctors && matchedDoctors.length > 0) 
        ? matchedDoctors 
        : (directMatchDoctors || []);

      // Store the result in the database if userId is provided
      if (userId) {
        console.log("Storing symptom check for user:", userId);
        
        const { error: dbError } = await supabaseClient
          .from('symptom_checks')
          .insert({
            user_id: userId,
            symptoms: sanitizedSymptoms,
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
        matchedDoctors: finalDoctors
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (aiError) {
      console.error('OpenAI API error:', aiError);
      
      // Fallback response with direct matched doctors
      return new Response(JSON.stringify({ 
        analysis: "We couldn't perform a detailed analysis at this time, but here are some specialists who might help with your symptoms.",
        recommendedAction: "virtual_consultation",
        recommendations: "Please consult with a healthcare professional about your symptoms.",
        matchedDoctors: directMatchDoctors || []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('General error:', error);
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
