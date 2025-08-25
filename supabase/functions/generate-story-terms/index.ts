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
    const { type } = await req.json();
    console.log('Generating content for type:', type);

    if (type === 'solutionstory') {
      // Generate question for SolutionStory
      const questionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'user', 
              content: 'Erstelle ein Ressourcen-Management Problem für Kinder (10-14 Jahre) mit maximal 200 Worten. Das Problem soll EINE klare, eindeutige Lösung haben, die in 1-3 Schritten beschreibbar ist. Beispiele: "Du hast 5€ und musst 3 Geschenke kaufen", "Du hast 2 Stunden Zeit für 4 Aufgaben", "Du hast nur 3 Zutaten für ein Rezept". Gib konkrete Zahlen, Mengen und Einschränkungen an. Am Ende schreibe: "Finde die beste Lösung für das Problem."' 
            }
          ],
          max_tokens: 500,
          temperature: 0.8
        }),
      });

      if (!questionResponse.ok) {
        console.error('OpenAI API error for question:', questionResponse.status, questionResponse.statusText);
        throw new Error(`OpenAI API error: ${questionResponse.status}`);
      }

      const questionData = await questionResponse.json();
      const question = questionData.choices[0].message.content.trim();

      // Generate answer for the question
      const answerResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'user', 
              content: `Hier ist ein Ressourcen-Problem: ${question}\n\nGib EINE konkrete, optimale Lösung in höchstens 3 kurzen Schritten. Die Lösung muss eindeutig und nachvollziehbar sein. Beginne direkt mit der Lösung, keine Einleitung. Beispiel: "1. Kaufe Geschenk A für 2€, 2. Kaufe Geschenk B für 1,50€, 3. Kaufe Geschenk C für 1,50€"` 
            }
          ],
          max_tokens: 500,
          temperature: 0.5
        }),
      });

      if (!answerResponse.ok) {
        console.error('OpenAI API error for answer:', answerResponse.status, answerResponse.statusText);
        throw new Error(`OpenAI API error: ${answerResponse.status}`);
      }

      const answerData = await answerResponse.json();
      const answer = answerData.choices[0].message.content.trim();

      console.log('Generated question and answer for SolutionStory');

      return new Response(
        JSON.stringify({ question, answer }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      // Original story terms generation
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
    }

  } catch (error) {
    console.error('Error in generate-story-terms function:', error);
    
    // Return appropriate fallback based on type
    const { type } = await req.json().catch(() => ({}));
    
    if (type === 'solutionstory') {
      return new Response(
        JSON.stringify({ 
          question: 'Fallback-Aufgabe: Du stehst vor einem verschlossenen Tor und hast nur einen Schlüssel, aber das Schloss ist kaputt. Wie kommst du hindurch?',
          answer: 'Schaue, ob es einen anderen Weg gibt: über eine Mauer klettern, einen Nebeneingang finden, oder jemanden um Hilfe bitten.',
          error: 'Fallback question used due to API error'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      // Return fallback terms for story generation
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
  }
});