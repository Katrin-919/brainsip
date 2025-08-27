import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    const { game_name, game_category, score, success } = await req.json();

    // Calculate points based on success and score
    let points_earned = 0;
    if (success) {
      points_earned = 50; // Base points for completion
      if (score >= 80) points_earned += 30; // Bonus for high score
      else if (score >= 60) points_earned += 20;
      else if (score >= 40) points_earned += 10;
    }

    // Check if user can play this game category today
    const { data: playLimit } = await supabaseClient
      .from("daily_play_limits")
      .select("*")
      .eq("user_id", user.id)
      .eq("game_category", game_category)
      .eq("play_date", new Date().toISOString().split('T')[0])
      .single();

    const freePlayUsed = playLimit?.free_plays_used || 0;
    const paidPlays = playLimit?.paid_plays || 0;

    if (freePlayUsed >= 1 && paidPlays <= freePlayUsed - 1) {
      return new Response(JSON.stringify({ 
        error: "Daily limit reached. Purchase additional plays to continue.",
        needsPayment: true 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    // Record game session
    const { error: sessionError } = await supabaseClient
      .from("game_sessions")
      .insert({
        user_id: user.id,
        game_name,
        game_category,
        points_earned,
        score,
        success
      });

    if (sessionError) throw sessionError;

    // Update daily play limits
    await supabaseClient
      .from("daily_play_limits")
      .upsert({
        user_id: user.id,
        game_category,
        play_date: new Date().toISOString().split('T')[0],
        free_plays_used: Math.min(1, freePlayUsed + 1),
        paid_plays: paidPlays
      }, { 
        onConflict: 'user_id,game_category,play_date'
      });

    // Update user's total points
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("total_points")
      .eq("user_id", user.id)
      .single();

    const newTotalPoints = (profile?.total_points || 0) + points_earned;

    await supabaseClient
      .from("profiles")
      .update({ total_points: newTotalPoints })
      .eq("user_id", user.id);

    return new Response(JSON.stringify({ 
      success: true,
      points_earned,
      total_points: newTotalPoints,
      canPlayAgain: freePlayUsed < 1 || paidPlays > freePlayUsed
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in complete-game:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});