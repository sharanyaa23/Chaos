import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChaosRequest {
  level: number;
  seenSituations: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { level, seenSituations } = await req.json() as ChaosRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const levelDescriptions: Record<number, string> = {
      0: `LEVEL 0 - Small Chaos:
- Very short everyday situations (1-2 lines max)
- Simple words only
- Small mistakes everyone makes
- Examples: oversleeping, snacking late, ignoring alarms`,
      
      1: `LEVEL 1 - Medium Chaos:
- Mini-story format (2-3 lines)
- Things start going wrong
- Multiple small problems
- Simple language only`,
      
      2: `LEVEL 2 - Full Chaos:
- Short story (3-4 lines)
- Everything is a mess
- Nothing goes right
- Over-the-top but relatable`,
    };

    const seenContext = seenSituations.length > 0 
      ? `\n\nDO NOT REPEAT these situations:\n${seenSituations.slice(-20).map((s, i) => `${i + 1}. "${s}"`).join('\n')}\n\nMake something COMPLETELY NEW and DIFFERENT.`
      : '';

    const systemPrompt = `You are CHAOS, a funny game where bad decisions win.

RULES:
1. Create ONE new situation
2. Use VERY SIMPLE English words (like talking to a 10 year old)
3. Keep sentences SHORT
4. Make exactly 3 DIFFERENT choices IN ENGLISH ONLY:
   - Choice 0 (CHAOTIC): The worst, funniest, most chaotic option. This is the "correct" answer in this game.
   - Choice 1 (SENSIBLE): The smart, responsible, safe thing to do
   - Choice 2 (NEUTRAL): Something in between
5. The 3 choices MUST be clearly different from each other
6. Write a funny outcome for the chaotic choice
7. Be playful, silly, non-judgmental
8. NO lectures, NO advice
9. ALWAYS respond in ENGLISH only

${levelDescriptions[level] || levelDescriptions[0]}
${seenContext}

CRITICAL: Return ONLY valid JSON, no markdown, no code blocks. Use this exact format:
{"situation":"Short situation here","choices":["The chaotic choice","The sensible choice","The neutral choice"],"chaotic_index":0,"sensible_index":1,"outcome":"Funny outcome","situation_id":"short-id"}`;

    console.log(`Generating chaos level ${level} with ${seenSituations.length} seen situations`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Create a level ${level} chaos situation. Use simple words. Make 3 very different choices. The chaotic choice should be clearly the worst option.` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too much chaos! Wait a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Chaos engine needs rest. Try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in response");
    }

    console.log("Raw AI response:", content);

    let chaosData;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      let jsonString = jsonMatch ? jsonMatch[1].trim() : content.trim();
      
      // Try to extract just the JSON object if there's extra text
      const objectMatch = jsonString.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        jsonString = objectMatch[0];
      }
      
      // Fix common JSON issues: trailing commas before ] or }
      jsonString = jsonString.replace(/,\s*]/g, ']').replace(/,\s*}/g, '}');
      
      // Fix incomplete JSON - ensure it ends with }
      if (!jsonString.trim().endsWith('}')) {
        // Try to complete the JSON by adding missing closing braces
        const openBraces = (jsonString.match(/{/g) || []).length;
        const closeBraces = (jsonString.match(/}/g) || []).length;
        jsonString = jsonString + '}'.repeat(openBraces - closeBraces);
      }
      
      chaosData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError, "Content:", content);
      throw new Error("Failed to parse chaos response");
    }

    // Validate we have exactly 3 choices
    if (!Array.isArray(chaosData.choices) || chaosData.choices.length !== 3) {
      throw new Error("Invalid choices format");
    }

    // Get indices (default to 0 and 1 if not provided)
    const chaoticIndex = chaosData.chaotic_index ?? 0;
    const sensibleIndex = chaosData.sensible_index ?? 1;

    // Shuffle choices while tracking original indices
    const indexedChoices = chaosData.choices.map((choice: unknown, originalIndex: number) => ({
      text: typeof choice === 'string' ? choice : String((choice as { text?: string })?.text || choice),
      originalIndex,
    }));
    
    const shuffled = [...indexedChoices].sort(() => Math.random() - 0.5);
    
    // Find new positions after shuffle
    const newChaoticIndex = shuffled.findIndex(c => c.originalIndex === chaoticIndex);
    const newSensibleIndex = shuffled.findIndex(c => c.originalIndex === sensibleIndex);

    return new Response(JSON.stringify({
      situation: chaosData.situation,
      choices: shuffled.map(c => c.text),
      chaoticIndex: newChaoticIndex,
      sensibleIndex: newSensibleIndex,
      outcome: chaosData.outcome,
      situationId: chaosData.situation_id || `chaos-${Date.now()}`,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-chaos:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Failed to generate chaos" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
