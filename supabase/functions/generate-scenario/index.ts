import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    console.log('Generating scenario with OpenAI...');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `Erstelle eine kurze, einfache Alltagssituation für Kinder im Alter von 10-12 Jahren, die zu negativen Gedanken führen könnte. Die Situation sollte:
    
    - Realistisch und altersgerecht sein
    - In 1-2 Sätzen beschrieben werden
    - Sich auf Schule, Familie, Freundschaften oder Hobbys beziehen
    - Raum für negative, aber auch positive Gedanken lassen
    
    Beispiele:
    "Du hast dich in Mathe vertippt und bekommst eine falsche Lösung heraus."
    "Eine Freundin antwortet heute noch nicht auf deine Nachricht."
    "Du hast beim Sport eine Übung nicht geschafft."
    
    Erstelle eine neue, ähnliche Situation.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 100,
        temperature: 0.8
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    const scenario = data.choices[0]?.message?.content?.trim();
    
    if (!scenario) {
      throw new Error('No scenario generated');
    }

    return new Response(JSON.stringify({ scenario }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-scenario function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate scenario',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});