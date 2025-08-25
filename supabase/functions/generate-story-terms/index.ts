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
    console.log('Generating story terms...');

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
            content: 'Du bist ein hilfreicher Assistent, der drei zufällige, kindgerechte Substantive generiert. Die Begriffe sollen für 10-jährige Kinder geeignet sein und greifbare Gegenstände darstellen.' 
          },
          { 
            role: 'user', 
            content: 'Generiere genau 3 verschiedene, zufällige Substantive (Hauptwörter), die für eine kreative Geschichte geeignet sind. Jedes Wort sollte einen konkreten Gegenstand bezeichnen. Antworte nur mit den drei Wörtern, getrennt durch Kommata.' 
          }
        ],
        max_tokens: 50,
        temperature: 0.9
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    const generatedText = data.choices[0].message.content.trim();
    console.log('Generated text:', generatedText);

    // Extract terms from the response
    let terms = generatedText.split(/[,;\n\/\|]+/)
      .map(term => term.trim())
      .filter(term => term.length > 0 && term.length < 30)
      .slice(0, 3);

    // Clean up terms (remove numbers, special characters)
    terms = terms.map(term => 
      term.replace(/\d+\s*[\.\)]\s*/, '')
          .replace(/[•\-–]/g, ' ')
          .trim()
    ).filter(term => term.length > 0);

    // Fallback if we don't have enough terms
    if (terms.length < 3) {
      terms = ['Hund', 'Regenbogen', 'Schokolade'];
    }

    console.log('Final terms:', terms);

    return new Response(
      JSON.stringify({ terms: terms.slice(0, 3) }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-story-terms function:', error);
    
    // Return fallback terms on error
    return new Response(
      JSON.stringify({ 
        terms: ['Hund', 'Regenbogen', 'Schokolade'],
        error: 'Fallback terms used due to API error'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});