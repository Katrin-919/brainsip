import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
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
    const { session_id } = await req.json();
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status === 'paid') {
      const supabaseService = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      // Update payment status
      await supabaseService
        .from("game_payments")
        .update({ status: "completed" })
        .eq("stripe_session_id", session_id);

      // Get payment details
      const { data: payment } = await supabaseService
        .from("game_payments")
        .select("*")
        .eq("stripe_session_id", session_id)
        .single();

      if (payment) {
        // Update daily play limits
        const today = new Date().toISOString().split('T')[0];
        const { data: currentLimit } = await supabaseService
          .from("daily_play_limits")
          .select("*")
          .eq("user_id", payment.user_id)
          .eq("game_category", payment.game_category)
          .eq("play_date", today)
          .single();

        await supabaseService
          .from("daily_play_limits")
          .upsert({
            user_id: payment.user_id,
            game_category: payment.game_category,
            play_date: today,
            free_plays_used: currentLimit?.free_plays_used || 0,
            paid_plays: (currentLimit?.paid_plays || 0) + payment.additional_plays
          }, { 
            onConflict: 'user_id,game_category,play_date'
          });
      }

      return new Response(JSON.stringify({ 
        success: true,
        message: "Payment verified and additional plays added"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ 
      success: false,
      message: "Payment not completed"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });

  } catch (error) {
    console.error("Error in verify-payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});