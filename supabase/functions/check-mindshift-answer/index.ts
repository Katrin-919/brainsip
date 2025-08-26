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
    const { negativeThought, positiveThought } = await req.json();

    console.log('Checking mindshift answer with OpenAI...');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!negativeThought || !positiveThought) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: negativeThought, positiveThought' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `Du bist ein pädagogisches Spiel-Auswertungs-System. Es geht darum, ob ein negativer, selbstabwertender Gedanke richtig erkannt und sinnvoll umformuliert wurde.

### Eingaben:
- Negativer Gedanke: "${negativeThought}"
- Positiver Gedanke: "${positiveThought}"

### Deine Aufgabe:
1. Prüfe, ob der negative Gedanke ein typischer, klar formulierter, selbstabwertender Satz ist – z. B.:
   - „Ich bin zu dumm."
   - „Ich schaffe das eh nicht."
   - „Ich bin nicht gut genug."
   - „Ich bin zu dick." usw.

2. Prüfe, ob die positive Umformulierung **inhaltlich zum negativen Satz passt** und in einfacher Sprache Hoffnung, Selbstvertrauen oder Handlungsfähigkeit ausdrückt.

3. Wenn beide Bedingungen erfüllt sind, gib zurück:
{
  "isValid": true,
  "feedback": "Gut gemacht! Du hast den Gedanken erkannt und sinnvoll umformuliert."
}

Wenn eine der Bedingungen nicht erfüllt ist, gib zurück:
{
  "isValid": false,
  "feedback": "Überlege noch mal, ob das wirklich ein typischer negativer Gedanke war und ob du ihn passend umformuliert hast."
}

Gib nur das JSON-Objekt zurück – keine Erklärungen, keine Kommentare.`;

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
        max_tokens: 150,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    const content = data.choices[0]?.message?.content?.trim();
    
    if (!content) {
      throw new Error('No content generated');
    }

    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', content);
      throw new Error('Invalid JSON response from OpenAI');
    }

    if (typeof result.isValid !== 'boolean') {
      throw new Error('Invalid response format from OpenAI');
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in check-mindshift-answer function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to check answer',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});