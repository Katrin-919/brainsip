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

  try {
    const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const prompt = `Erstelle 10 unterschiedliche, altersgerechte Quizfragen für Kinder im Alter von 10–12 Jahren zum Thema Lösungsorientierung. Jede Frage soll eine Alltagssituation beschreiben (z. B. Streit, Schule, Familie, Freunde) und zwei mögliche Antworten enthalten (A und B). Markiere, welche Antwort lösungsorientiert ist.

Gib die Ausgabe ausschließlich als JSON-Array im folgenden Format zurück:

[
  {
    "question": "Frage...",
    "answerA": "Antwort A...",
    "answerB": "Antwort B...",
    "solutionOriented": "A" oder "B"
  }
]

Vermeide Wiederholungen und variiere die Szenarien. Gib **nur den JSON-Block** zurück, ohne weitere Kommentare.
Gib nur das JSON zurück – keine Erklärungen oder Kommentare.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Keine Antwort von der API erhalten.');
    }

    const raw = data.choices[0].message.content;
    console.log('Raw response:', raw);

    // Extract JSON from the response
    const jsonMatch = raw.match(/\[\s*\{.*?\}\s*\]/s);
    if (!jsonMatch) {
      throw new Error('Kein gültiger JSON-Block gefunden.');
    }

    const questions = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(questions)) {
      throw new Error('Response ist kein Array');
    }

    return new Response(JSON.stringify({ content: questions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-quiz-questions function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Unbekannter Fehler aufgetreten' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});