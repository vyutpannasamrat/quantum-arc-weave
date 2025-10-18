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
    const { actionId, description, imageUrl, locationName } = await req.json();
    console.log('Analyzing action:', actionId);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Build AI prompt
    let userPrompt = `Analyze this community action submission:

Description: "${description}"`;

    if (locationName) {
      userPrompt += `\nLocation: ${locationName}`;
    }

    if (imageUrl) {
      userPrompt += `\nProof Image Provided: Yes`;
    }

    userPrompt += `\n\nProvide a structured analysis with scores (0-1 range) for:
1. Sentiment Score: Measure positivity and constructive nature
2. Relevance Score: Alignment with community values (environmental sustainability, social support, civic engagement)
3. Quality Score: Authenticity, completeness, and verifiable impact
4. Brief Feedback: 2-3 sentences explaining the assessment

Return ONLY valid JSON in this exact format:
{
  "sentiment_score": 0.85,
  "relevance_score": 0.90,
  "quality_score": 0.88,
  "feedback": "Your explanation here"
}`;

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an AI ethics and community impact assessor for QuantumMesh, a decentralized trust network. Analyze community actions and provide scores and feedback. Always return valid JSON only, no markdown or extra text.'
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI response:', JSON.stringify(aiData));
    
    let analysisResult;
    const aiContent = aiData.choices[0].message.content;
    
    // Try to parse the JSON from the response
    try {
      // Remove markdown code blocks if present
      const cleanedContent = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisResult = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent);
      // Fallback to default scores
      analysisResult = {
        sentiment_score: 0.7,
        relevance_score: 0.7,
        quality_score: 0.7,
        feedback: 'Action received. Manual review may be needed for detailed assessment.'
      };
    }

    // Validate scores are in 0-1 range
    const validateScore = (score: number) => Math.max(0, Math.min(1, score || 0.5));
    
    const sentimentScore = validateScore(analysisResult.sentiment_score);
    const relevanceScore = validateScore(analysisResult.relevance_score);
    const qualityScore = validateScore(analysisResult.quality_score);
    const feedback = analysisResult.feedback || 'Action analyzed successfully.';

    // Calculate dynamic tokens
    const baseTokens = 5;
    const qualityMultiplier = 1 + (qualityScore * 2); // 1x to 3x
    const completenessBonus = (imageUrl && locationName) ? 5 : 0;
    const tokensEarned = Math.round(baseTokens * qualityMultiplier + completenessBonus);

    // Determine status based on quality score
    const status = qualityScore >= 0.6 ? 'approved' : 'pending';

    // Update action with analysis results
    const { error: updateError } = await supabase
      .from('actions')
      .update({
        sentiment_score: sentimentScore,
        relevance_score: relevanceScore,
        quality_score: qualityScore,
        ai_feedback: feedback,
        tokens_earned: tokensEarned,
        status: status
      })
      .eq('id', actionId);

    if (updateError) {
      console.error('Error updating action:', updateError);
      throw updateError;
    }

    console.log('Action analyzed successfully:', {
      actionId,
      sentimentScore,
      relevanceScore,
      qualityScore,
      tokensEarned,
      status
    });

    return new Response(
      JSON.stringify({
        sentiment_score: sentimentScore,
        relevance_score: relevanceScore,
        quality_score: qualityScore,
        feedback: feedback,
        tokens_earned: tokensEarned,
        status: status
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-action:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
