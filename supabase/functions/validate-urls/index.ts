
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
    const { urls } = await req.json();
    
    console.log(`Validating ${urls.length} URLs`);
    
    const results = await Promise.all(
      urls.map(async (url: string) => {
        try {
          const response = await fetch(url, {
            method: 'HEAD',
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; URL-Validator/1.0)'
            }
          });
          
          return {
            url,
            valid: response.ok,
            status: response.status,
            redirected: response.redirected,
            finalUrl: response.url
          };
        } catch (error) {
          console.error(`Failed to validate ${url}:`, error.message);
          return {
            url,
            valid: false,
            status: 0,
            error: error.message
          };
        }
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        results: results,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )

  } catch (error) {
    console.error('URL validation error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
