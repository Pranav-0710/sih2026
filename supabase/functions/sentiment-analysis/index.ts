// Supabase Edge Function for Hugging Face sentiment analysis
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const huggingFaceApiKey = Deno.env.get('HUGGINGFACE_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
const supabase = createClient(supabaseUrl, supabaseServiceKey);
// Hugging Face sentiment analysis
async function analyzeSentiment(text) {
  if (!huggingFaceApiKey) throw new Error('Hugging Face API key not configured');
  const model = 'lxyuan/distilbert-base-multilingual-cased-sentiments-student';
  const apiUrl = `https://api-inference.huggingface.co/models/${model}`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${huggingFaceApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: text
    })
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Hugging Face API error: ${response.status} - ${errorText}`);
    throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
  }
  const data = await response.json();
  if (!data || !data.length || !data[0].length) throw new Error('Invalid response from Hugging Face API');
  const results = data[0];
  const topResult = results.reduce((prev, current)=>prev.score > current.score ? prev : current);
  return {
    sentiment: topResult.label.toLowerCase(),
    confidence: topResult.score
  };
}
// Edge Function handler
serve(async (req)=>{
  if (req.method === 'OPTIONS') return new Response(null, {
    headers: corsHeaders
  });
  try {
    const requestBody = await req.json();
    const { batchAnalysis, text } = requestBody;
    // ----- Batch analysis -----
    if (batchAnalysis) {
      const { data: reviews, error: reviewsError } = await supabase.from('reviews').select('id, content, title, rating').not('content', 'is', null);
      if (reviewsError) throw reviewsError;
      const { data: posts, error: postsError } = await supabase.from('community_posts').select('id, content, title').not('content', 'is', null);
      if (postsError) throw postsError;
      const reviewPromises = (reviews || []).map(async (review)=>{
        try {
          const textToAnalyze = `${review.title || ''} ${review.content}`.trim().substring(0, 1000);
          if (textToAnalyze.length > 10) {
            const sentiment = await analyzeSentiment(textToAnalyze);
            await supabase.from('sentiment_results').insert({
              type: 'review',
              item_id: review.id,
              sentiment: sentiment.sentiment,
              confidence: sentiment.confidence,
              rating: review.rating
            });
            return {
              type: 'review',
              id: review.id,
              sentiment: sentiment.sentiment,
              confidence: sentiment.confidence,
              rating: review.rating,
              content: textToAnalyze.substring(0, 100) + '...'
            };
          }
        } catch (error) {
          console.error(`Error analyzing review ${review.id}:`, error);
          return null;
        }
      });
      const postPromises = (posts || []).map(async (post)=>{
        try {
          const textToAnalyze = `${post.title || ''} ${post.content}`.trim().substring(0, 1000);
          if (textToAnalyze.length > 10) {
            const sentiment = await analyzeSentiment(textToAnalyze);
            await supabase.from('sentiment_results').insert({
              type: 'community_post',
              item_id: post.id,
              sentiment: sentiment.sentiment,
              confidence: sentiment.confidence
            });
            return {
              type: 'community_post',
              id: post.id,
              sentiment: sentiment.sentiment,
              confidence: sentiment.confidence,
              content: textToAnalyze.substring(0, 100) + '...'
            };
          }
        } catch (error) {
          console.error(`Error analyzing post ${post.id}:`, error);
          return null;
        }
      });
      const analysisResults = (await Promise.all([
        ...reviewPromises,
        ...postPromises
      ])).filter((r)=>r !== null);
      const totalAnalyzed = analysisResults.length;
      const positiveCount = analysisResults.filter((r)=>r.sentiment === 'positive').length;
      const negativeCount = analysisResults.filter((r)=>r.sentiment === 'negative').length;
      const neutralCount = analysisResults.filter((r)=>r.sentiment === 'neutral').length;
      const averageConfidence = totalAnalyzed > 0 ? analysisResults.reduce((sum, r)=>sum + r.confidence, 0) / totalAnalyzed : 0;
      return new Response(JSON.stringify({
        success: true,
        results: analysisResults,
        statistics: {
          total: totalAnalyzed,
          positive: positiveCount,
          negative: negativeCount,
          neutral: neutralCount,
          averageConfidence
        }
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    // ----- Single text analysis -----
    if (!text || text.trim().length === 0) throw new Error('Text is required for analysis');
    const sentiment = await analyzeSentiment(text.trim());
    return new Response(JSON.stringify({
      success: true,
      result: sentiment
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in sentiment-analysis function:', error);
    return new Response(JSON.stringify({
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});