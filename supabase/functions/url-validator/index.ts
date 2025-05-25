
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { urls, provider_name } = await req.json();
    
    console.log(`🔍 Starting URL validation for ${urls?.length || 'all'} URLs`);

    const validationResults = await validateUrls(urls || []);

    return new Response(JSON.stringify({
      success: true,
      results: validationResults,
      summary: {
        total: validationResults.length,
        valid: validationResults.filter(r => r.is_valid).length,
        invalid: validationResults.filter(r => !r.is_valid).length
      },
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('URL validation error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function validateUrls(urls: string[]) {
  const results = [];
  
  for (const url of urls) {
    const startTime = Date.now();
    
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        redirect: 'follow'
      });
      
      results.push({
        url,
        is_valid: response.ok,
        status_code: response.status,
        response_time_ms: Date.now() - startTime,
        redirect_url: response.url !== url ? response.url : undefined
      });
      
    } catch (error) {
      results.push({
        url,
        is_valid: false,
        response_time_ms: Date.now() - startTime,
        error_message: error.message
      });
    }
  }
  
  console.log(`✅ Validated ${results.length} URLs`);
  return results;
}
