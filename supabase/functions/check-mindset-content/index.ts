
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { content } = await req.json()

    // Validate input
    if (!content || typeof content !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Der Inhalt darf nicht leer sein.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const trimmedContent = content.trim()
    const wordCount = trimmedContent.split(/\s+/).filter(word => word.length > 0).length

    if (wordCount < 40) {
      return new Response(
        JSON.stringify({ 
          error: `Der Text muss mindestens 40 Wörter haben. Aktuelle Wortanzahl: ${wordCount}.` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create the prompt for OpenAI API
    const prompt = `Bitte überprüfe diesen Text: "${trimmedContent}". Prüfe:
    1. Wurde Fixed Mindset korrekt erklärt?
    2. Wurde Growth Mindset korrekt erklärt?
    3. Hat der Text thematisch mit Mindset zu tun?
    Gib eine JSON-Antwort im folgenden Format zurück:
    {
        "fixedMindsetCorrect": true/false,
        "growthMindsetCorrect": true/false,
        "isOnTopic": true/false,
        "feedback": "Gib dem Nutzer ein kurzes Feedback."
    }`

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Du bist ein hilfreicher Assistent, der Texte über Fixed und Growth Mindset prüft. Du bewertest, ob die Begriffe korrekt erklärt wurden und ob der Text thematisch mit Mindset verbunden ist.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
      }),
    })

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.statusText}`)
    }

    const openAIResult = await openAIResponse.json()
    const responseContent = openAIResult.choices[0]?.message?.content?.trim()

    if (!responseContent) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response from OpenAI
    const result = JSON.parse(responseContent)

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in check-mindset-content function:', error)
    return new Response(
      JSON.stringify({ error: 'Interner Serverfehler. Bitte versuche es später erneut.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
