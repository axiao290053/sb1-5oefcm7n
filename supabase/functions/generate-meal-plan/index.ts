import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface UserPreferences {
  goal: "lose_weight" | "gain_muscle" | "eat_healthy";
  dietType: "high_protein" | "vegetarian" | "low_carb";
  calories: number | null;
  avoidFoods: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prefs: UserPreferences = await req.json();

    const goalLabel = { lose_weight: "lose weight", gain_muscle: "gain muscle", eat_healthy: "eat healthy" }[prefs.goal];
    const dietLabel = { high_protein: "high protein", vegetarian: "vegetarian", low_carb: "low carb" }[prefs.dietType];
    const targetCalories = prefs.calories ?? (prefs.goal === "gain_muscle" ? 2500 : prefs.goal === "lose_weight" ? 1600 : 2000);
    const avoidClause = prefs.avoidFoods.length > 0 ? `Avoid these foods: ${prefs.avoidFoods.join(", ")}.` : "";

    const systemPrompt = `You are a professional nutritionist and meal planning expert.
You create practical, tasty, and nutritionally balanced meal plans.
Always respond with valid JSON only — no markdown, no explanation text.`;

    const userPrompt = `Create a 7-day personalized meal plan for someone who wants to ${goalLabel}.
Diet type: ${dietLabel}.
Daily calorie target: approximately ${targetCalories} kcal.
${avoidClause}

Return a JSON object with this exact structure:
{
  "days": [
    {
      "day": "Monday",
      "breakfast": { "name": string, "calories": number, "protein": number, "carbs": number, "fat": number, "ingredients": string[] },
      "lunch":     { "name": string, "calories": number, "protein": number, "carbs": number, "fat": number, "ingredients": string[] },
      "dinner":    { "name": string, "calories": number, "protein": number, "carbs": number, "fat": number, "ingredients": string[] },
      "snack":     { "name": string, "calories": number, "protein": number, "carbs": number, "fat": number, "ingredients": string[] },
      "totalCalories": number
    }
    // ... 7 days total: Monday through Sunday
  ],
  "groceryList": [
    { "name": string, "category": "Produce"|"Protein"|"Dairy & Eggs"|"Grains & Bread"|"Nuts & Seeds"|"Condiments & Spices"|"Beverages"|"Frozen & Canned" }
  ]
}

Rules:
- All 7 days must be present (Monday through Sunday).
- Vary meals — no repeated meal names across the week.
- Macros (protein + carbs + fat in grams * 4/4/9) should approximately match calories.
- Ingredients should be simple, everyday items.
- groceryList must be a deduplicated flat list of all ingredients with the correct category.
- Respond with raw JSON only.`;

    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 4096,
        response_format: { type: "json_object" },
      }),
    });

    if (!openAIResponse.ok) {
      const errText = await openAIResponse.text();
      return new Response(JSON.stringify({ error: `OpenAI error: ${errText}` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const completion = await openAIResponse.json();
    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      return new Response(JSON.stringify({ error: "Empty response from OpenAI" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const weekPlan = JSON.parse(content);

    return new Response(JSON.stringify(weekPlan), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
