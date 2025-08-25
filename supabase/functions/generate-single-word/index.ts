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
    console.log('Generating single word...');

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
            content: 'Du antwortest nur mit einem einzigen deutschen Substantiv - einem greifbaren Gegenstand.' 
          },
          { 
            role: 'user', 
            content: 'Nenne einen Gegenstand für Kinder (z.B. "Bleistift")' 
          }
        ],
        max_tokens: 5,
        temperature: 1.0,
      }),
    });

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (data.choices && data.choices[0] && data.choices[0].message) {
      const generatedText = data.choices[0].message.content.trim();
      console.log('Generated text:', generatedText);
      
      // Clean the word - remove any extra text or punctuation
      const cleanWord = generatedText.replace(/[^\p{L}\p{M}\-\s]/gu, '').trim();
      console.log('Clean word:', cleanWord);

      return new Response(JSON.stringify({ word: cleanWord }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('No word generated');
  } catch (error) {
    console.error('Error in generate-single-word function:', error);
    
    // Fallback words for 10-year-olds
    const fallbackWords = [
      'Taschenlampe', 'Regenschirm', 'Bleistift', 'Küchensieb', 'Springseil',
      'Gartenschlauch', 'Kochlöffel', 'Federmappe', 'Spielzeugauto', 'Luftballon'
    ];
    const randomWord = fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
    
    return new Response(JSON.stringify({ word: randomWord }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});