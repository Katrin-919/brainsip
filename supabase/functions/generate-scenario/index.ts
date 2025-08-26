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

    const prompt = `Erstelle ein kreatives Alltagsszenario mit maximal 300 Wörtern, in dem eine Person einen negativen, selbstabwertenden Gedanken hat.

⚠️ Wichtig: Es ist zwingend erforderlich, dass ein klar formulierter, selbstabwertender Gedanke als **wörtlicher Satz** im Text enthalten ist – z. B. als innerer Monolog, Selbstgespräch oder laut ausgesprochener Satz.

Beispiele für solche Gedanken:
- „Ich bin zu dumm."
- „Ich bin zu dick."
- „Ich bin nicht gut genug."
- „Ich schaffe das sowieso nicht."
- „Ich bin hässlich."
- „Ich gehöre nicht dazu."

💡 Der Gedanke muss **genau so oder sinngemäß in einfacher Alltagssprache** vorkommen – in **Anführungszeichen** oder deutlich als wörtlich formuliert.

Zusätzlich soll das Szenario:
- eine konkrete Alltagssituation beschreiben
- Umgebungsdetails enthalten (Ort, Geräusche, Licht etc.)
- Körpersprache und emotionale Reaktion der Person schildern

Gib die Antwort exakt in diesem JSON-Format zurück:
{
  "scenario": "Beschreibe hier das Szenario.",
  "negativeThought": "Der wörtlich formulierte negative Gedanke aus dem Text.",
  "positiveThought": "Eine passende positive Umdeutung dieses Gedankens."
}`;

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
        max_tokens: 700,
        temperature: 0.9
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    const responseContent = data.choices[0]?.message?.content?.trim();
    
    if (!responseContent) {
      throw new Error('No response content from OpenAI');
    }

    // Parse the JSON response from OpenAI
    const result = JSON.parse(responseContent);
    
    if (result && result.scenario && result.negativeThought && result.positiveThought) {
      return new Response(JSON.stringify({
        scenario: result.scenario,
        examples: {
          negativeThought: result.negativeThought,
          positiveThought: result.positiveThought
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      throw new Error('Invalid JSON response structure from OpenAI');
    }

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