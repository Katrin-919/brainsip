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

  if (!openAIApiKey) {
    console.error('OpenAI API key not found');
    return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const prompt = `Erstelle ein realistisches, altersgerechtes Konfliktszenario für Kinder zwischen 10 und 14 Jahren. Danach nenne drei mögliche Reaktionen:
- Nur EINE dieser Reaktionen soll deeskalierend und sozial kompetent sein.
- Die anderen beiden sollen nachvollziehbar, aber nicht optimal sein.

Gib die Antwort in folgendem JSON-Format zurück (keine zusätzlichen Erklärungen):

{
 "conflict": "Kurze Beschreibung des Konflikts (1-2 Sätze)",
 "options": ["Option A", "Option B", "Option C"],
 "correctIndex": 0
}

Erfinde in jeder Anfrage ein neues Szenario mit unterschiedlichen Optionen.`;

    console.log('Making request to OpenAI...');

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
        max_tokens: 700,
        temperature: 0.8
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    const responseContent = data.choices[0].message.content.trim();
    console.log('Response content:', responseContent);

    // Extract JSON from response
    const jsonMatch = responseContent.match(/\{.*\}/s);
    if (!jsonMatch) {
      console.error('No JSON found in response:', responseContent);
      throw new Error('No valid JSON block found in response');
    }

    const jsonString = jsonMatch[0];
    const result = JSON.parse(jsonString);

    // Validate the response structure
    if (!result.conflict || !Array.isArray(result.options) || result.correctIndex === undefined) {
      console.error('Invalid response structure:', result);
      throw new Error('Invalid response structure');
    }

    // Shuffle options and update correct index
    const correctAnswer = result.options[result.correctIndex];
    const shuffledOptions = [...result.options];
    
    // Simple shuffle algorithm
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }
    
    const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);

    const finalResult = {
      conflict: result.conflict,
      options: shuffledOptions,
      correctIndex: newCorrectIndex
    };

    console.log('Sending final result:', finalResult);

    return new Response(JSON.stringify(finalResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-conflict function:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate conflict scenario' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});