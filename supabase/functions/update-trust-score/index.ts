import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, qualityScore, sentimentScore, relevanceScore, imageProvided, tokensEarned } = await req.json();
    console.log('Updating trust score for user:', userId);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Get current profile
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('trust_score, impact_tokens')
      .eq('id', userId)
      .single();

    if (fetchError || !profile) {
      console.error('Error fetching profile:', fetchError);
      throw new Error('Profile not found');
    }

    // Calculate trust score delta
    const qualityWeight = 0.6;
    const sentimentWeight = 0.2;
    const relevanceWeight = 0.2;
    
    const baseScore = (
      qualityScore * qualityWeight +
      sentimentScore * sentimentWeight +
      relevanceScore * relevanceWeight
    );

    // Image verification bonus
    const imageBonus = imageProvided ? 0.1 : 0;
    
    const totalScore = baseScore + imageBonus;

    // Determine trust score delta based on total score
    let trustScoreDelta = 0;
    if (totalScore >= 0.8) {
      trustScoreDelta = Math.round(3 + (totalScore - 0.8) * 10); // +3 to +5
    } else if (totalScore >= 0.6) {
      trustScoreDelta = Math.round(1 + (totalScore - 0.6) * 10); // +1 to +3
    } else if (totalScore >= 0.4) {
      trustScoreDelta = Math.round(totalScore * 2); // 0 to +1
    } else {
      trustScoreDelta = -1; // Penalty for poor quality
    }

    // Calculate new trust score (capped at 0-100)
    const newTrustScore = Math.max(0, Math.min(100, profile.trust_score + trustScoreDelta));
    const newImpactTokens = profile.impact_tokens + tokensEarned;

    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        trust_score: newTrustScore,
        impact_tokens: newImpactTokens
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      throw updateError;
    }

    console.log('Trust score updated:', {
      userId,
      oldTrustScore: profile.trust_score,
      newTrustScore,
      delta: trustScoreDelta,
      tokensAdded: tokensEarned,
      newTotalTokens: newImpactTokens
    });

    return new Response(
      JSON.stringify({
        trust_score: newTrustScore,
        trust_score_delta: trustScoreDelta,
        impact_tokens: newImpactTokens,
        tokens_earned: tokensEarned
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in update-trust-score:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
