import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { original, rewrite } = await req.json();
    
    if (!original || !rewrite) {
      return new Response(JSON.stringify({ error: 'Missing original or rewrite text' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `Hier ist ein vorwurfsvoller Satz: "${original}"  
Und hier ist die Umformulierung: "${rewrite}"

Bewerte, ob die Umformulierung eine echte Ich-Botschaft ist.  
Eine gute Ich-Botschaft beschreibt:
- ein Gefühl (z. B. traurig, wütend, enttäuscht),
- die eigene Perspektive,
- ohne das Gegenüber direkt zu beschuldigen.

Gib eine Rückmeldung **ausschließlich** im JSON-Format zurück – keine Markdown-Formatierung, keine Erklärungen. Beispiel:
{
  "feedback": "Dein Feedback in einer kindgerechten Sprache"
}`;

    console.log('Checking ich-botschaft...');
    console.log('Original:', original);
    console.log('Rewrite:', rewrite);

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
        max_tokens: 300,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      return new Response(JSON.stringify({ error: 'OpenAI API error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response structure');
      return new Response(JSON.stringify({ error: 'Invalid API response' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const responseContent = data.choices[0].message.content.trim();
    console.log('Raw OpenAI content:', responseContent);

    // Extract JSON from the response
    const jsonMatch = responseContent.match(/\{.*\}/s);
    if (!jsonMatch) {
      console.error('No JSON found in response');
      return new Response(JSON.stringify({ error: 'No valid JSON found in response' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result = JSON.parse(jsonMatch[0]);
    
    if (!result.feedback) {
      console.error('Missing feedback in parsed result');
      return new Response(JSON.stringify({ error: 'Missing feedback in response' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Generated feedback:', result.feedback);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in check-ichbotschaft function:', error);
    return new Response(JSON.stringify({ 
      error: 'Error checking ich-botschaft',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});