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

  if (!openAIApiKey) {
    console.error('Missing OpenAI API key');
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const prompt = `Erstelle ein Gefühlsszenario für Kinder im Alter von 10–12 Jahren.

🔹 Die Szene soll:
- maximal 3–4 Sätze lang sein,
- eine Alltagssituation beschreiben (z. B. Schule, Freizeit, Familie),
- die Körpersprache und Umgebung der Hauptperson darstellen,
- am Ende die Frage enthalten: **„Wie fühlt sich die Person?"**

🔹 Danach sollst du:
- drei plausible Gefühlsoptionen angeben (z. B. „ängstlich", „verlegen", „stolz"),
- die richtige Option klar auswählen,
- den Index der richtigen Option in einem Feld "correct" angeben (0 = erste Antwort, 1 = zweite …),
- eine kindgerechte Rückmeldung im Feld "feedback" geben, wenn die richtige Antwort gewählt wurde (z. B. „Super! Du hast gut beobachtet.").

🔹 Gib die gesamte Antwort ausschließlich im folgenden JSON-Format zurück:

{
  "text": "Szenenbeschreibung mit abschließender Frage.",
  "options": ["Gefühl A", "Gefühl B", "Gefühl C"],
  "correct": 1,
  "feedback": "Kindgerechte Rückmeldung für die richtige Auswahl"
}

Bitte keine weiteren Erklärungen oder Einleitungen. Gib nur den JSON-Block zurück.`;

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
        max_tokens: 600,
        temperature: 0.8
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();

    if (!content) {
      throw new Error('No content received from OpenAI API');
    }

    console.log('Raw OpenAI response:', content);

    // Extract JSON from the response
    const jsonMatch = content.match(/\{.*\}/s);
    if (!jsonMatch) {
      console.error('No JSON found in response:', content);
      throw new Error('No valid JSON found in response');
    }

    let scenarioData;
    try {
      scenarioData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Failed to parse:', jsonMatch[0]);
      throw new Error('Failed to parse JSON response');
    }

    // Validate the response structure
    if (!scenarioData.text || !Array.isArray(scenarioData.options) || 
        typeof scenarioData.correct !== 'number' || !scenarioData.feedback) {
      console.error('Invalid scenario structure:', scenarioData);
      throw new Error('Invalid scenario structure');
    }

    // Validate that the correct index is within bounds
    if (scenarioData.correct < 0 || scenarioData.correct >= scenarioData.options.length) {
      console.error('Correct index out of bounds:', scenarioData);
      throw new Error('Correct index out of bounds');
    }

    console.log('Generated scenario:', scenarioData);

    return new Response(JSON.stringify(scenarioData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-feeling-scenario function:', error);
    
    // Fallback response
    const fallbackScenario = {
      text: "Lisa hat eine wichtige Klassenarbeit zurückbekommen. Sie schaut auf das Blatt, lächelt breit und springt vor Freude auf. Wie fühlt sich Lisa?",
      options: ["traurig", "stolz", "ängstlich"],
      correct: 1,
      feedback: "Richtig! Lisa ist stolz auf ihr gutes Ergebnis."
    };

    return new Response(JSON.stringify(fallbackScenario), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});