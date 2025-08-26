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

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const topics = [
      'Mathematik', 'Kunst', 'Sport', 'Freundschaften', 'Videospiele', 'Musik', 'Selbstvertrauen',
      'Lesen', 'Schreiben', 'Naturwissenschaften', 'Technologie', 'Abenteuer', 'Familie', 'Haustiere',
      'Umwelt', 'Teamarbeit', 'Geduld', 'Mut', 'Verantwortung', 'Kochen', 'Reisen', 'Tanzen', 'Schwimmen',
      'Malerei', 'Fotografie', 'Astronomie', 'Programmierung', 'Gartenarbeit', 'Theater', 'Geschichte',
      'Fantasie', 'Problemlösung', 'Zeitmanagement', 'Empathie', 'Zielsetzung', 'Stressbewältigung',
      'Kreatives Denken', 'Lernen aus Fehlern', 'Selbstdisziplin', 'Dankbarkeit', 'Optimismus', 'Humor'
    ];

    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    const prompt = `Generiere ein Statement für Kinder (10-12 Jahre) über das Thema ${randomTopic}, das entweder ein Fixed oder Growth Mindset zeigt. Variiere die Satzstruktur. Antworte nur im JSON-Format:
    {
        "statement": "Hier steht das Statement",
        "type": "fixed ODER growth",
        "explanation": "Erklärung, warum es dieser Mindset-Typ ist."
    }`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.9
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const rawResult = data.choices[0].message.content.trim();

    console.log('Raw API Response:', rawResult);

    // Extract JSON from response
    const jsonMatch = rawResult.match(/\{.*?\}/s);
    if (!jsonMatch) {
      throw new Error('No valid JSON blocks found in response');
    }

    const result = JSON.parse(jsonMatch[0]);

    if (!result.statement || !result.type || !result.explanation) {
      throw new Error('Invalid JSON structure in API response');
    }

    // Validate type
    if (result.type !== 'fixed' && result.type !== 'growth') {
      throw new Error('Invalid mindset type in response');
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-mindset-statements function:', error);
    return new Response(JSON.stringify({ 
      error: 'Fehler beim Generieren der Mindset-Statements.',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});