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
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  if (!openAIApiKey) {
    console.error('OpenAI API key not found');
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    const prompt = `Erstelle fünf inhaltlich passende Aussagepaare zum Thema Mindset für Kinder (10–12 Jahre). Jede Paarung soll aus einer Aussage im Fixed Mindset und einer passenden im Growth Mindset bestehen.

Formatiere die Antwort ausschließlich als JSON-Array mit folgendem Format:

[
  {
    "fixed": "Ich bin einfach kein Mathe-Typ.",
    "growth": "Ich kann Mathe lernen, wenn ich dranbleibe."
  }
]

Bitte keine Einleitung, Erklärung oder Text außerhalb des JSON.`;

    console.log('Sending request to OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    const content = data.choices[0].message.content.trim();
    console.log('Raw content from OpenAI:', content);

    // Extract JSON block using regex
    const jsonMatch = content.match(/\[.*\]/s);
    if (!jsonMatch) {
      console.error('No valid JSON block found in response:', content);
      return new Response(
        JSON.stringify({ error: 'Kein gültiger JSON-Block gefunden.' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const pairs = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(pairs)) {
      console.error('Parsed content is not an array:', pairs);
      return new Response(
        JSON.stringify({ error: 'Ungültiges JSON-Format.' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Successfully generated pairs:', pairs.length);

    return new Response(
      JSON.stringify({ pairs }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in generate-mindset-pairs function:', error);
    return new Response(
      JSON.stringify({ error: 'Fehler beim Generieren der Aussagepaare.' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});