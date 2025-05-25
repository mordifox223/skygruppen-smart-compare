
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ScrapingRequest {
  provider: string;
  category: string;
  baseUrl: string;
}

interface ProductData {
  name: string;
  url: string;
  price: string;
  description: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { provider, category, baseUrl }: ScrapingRequest = await req.json();
    
    console.log(`Scraping live data for ${provider} in category ${category}`);
    
    // Fetch the webpage
    const response = await fetch(baseUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${baseUrl}: ${response.status}`);
    }

    const html = await response.text();
    const products = await parseProductsFromHtml(html, provider, category, baseUrl);

    return new Response(
      JSON.stringify({
        success: true,
        products: products,
        scrapedFrom: baseUrl,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )

  } catch (error) {
    console.error('Live scraping error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        products: []
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})

async function parseProductsFromHtml(html: string, provider: string, category: string, baseUrl: string): Promise<ProductData[]> {
  const products: ProductData[] = [];
  
  // Basic HTML parsing using regex (for demonstration)
  // In production, you'd want to use a proper HTML parser
  
  try {
    // Extract product information based on provider
    switch (provider.toLowerCase()) {
      case 'talkmore':
        return parseTalkmoreProducts(html, baseUrl);
      case 'fjordkraft':
        return parseFjordkraftProducts(html, baseUrl);
      case 'if_forsikring':
        return parseIfInsuranceProducts(html, baseUrl);
      case 'sparebank1':
        return parseSparebank1Products(html, baseUrl);
      default:
        return parseGenericProducts(html, baseUrl);
    }
  } catch (error) {
    console.error(`Error parsing products for ${provider}:`, error);
    return [];
  }
}

function parseTalkmoreProducts(html: string, baseUrl: string): ProductData[] {
  const products: ProductData[] = [];
  
  // Look for typical Talkmore product patterns
  const productPatterns = [
    /Smart \d+GB[\s\S]*?(\d+)\s*kr/gi,
    /abonnement[\s\S]*?(\d+)\s*kr/gi
  ];

  // Extract product names and prices
  const nameMatches = html.match(/Smart \d+GB|Talkmore \w+/gi) || [];
  const priceMatches = html.match(/(\d+)\s*kr/gi) || [];
  const linkMatches = html.match(/href="([^"]*abonnement[^"]*)"/gi) || [];

  for (let i = 0; i < Math.min(nameMatches.length, priceMatches.length); i++) {
    const name = nameMatches[i];
    const price = priceMatches[i];
    let url = baseUrl;
    
    if (linkMatches[i]) {
      const linkMatch = linkMatches[i].match(/href="([^"]*)"/);
      if (linkMatch) {
        url = linkMatch[1].startsWith('http') ? linkMatch[1] : `https://www.talkmore.no${linkMatch[1]}`;
      }
    }

    products.push({
      name: name.trim(),
      url: url,
      price: price.replace(/\s/g, ''),
      description: `Talkmore ${name} - mobilabonnement`
    });
  }

  return products;
}

function parseFjordkraftProducts(html: string, baseUrl: string): ProductData[] {
  const products: ProductData[] = [];
  
  // Look for Fjordkraft electricity plans
  const planNames = html.match(/Variabel|Fast|Spotpris|Strøm[\w\s]*/gi) || [];
  const prices = html.match(/(\d+)\s*kr/gi) || [];
  
  planNames.forEach((name, index) => {
    products.push({
      name: name.trim(),
      url: baseUrl,
      price: prices[index] || 'Se pris',
      description: `Fjordkraft ${name} - strømavtale`
    });
  });

  return products;
}

function parseIfInsuranceProducts(html: string, baseUrl: string): ProductData[] {
  const products: ProductData[] = [];
  
  // Look for If insurance products
  const insuranceTypes = html.match(/Kasko|Ansvar|Delkasko|Bilforsikring[\w\s]*/gi) || [];
  
  insuranceTypes.forEach((type) => {
    products.push({
      name: type.trim(),
      url: baseUrl,
      price: 'Få tilbud',
      description: `If ${type} - bilforsikring`
    });
  });

  return products;
}

function parseSparebank1Products(html: string, baseUrl: string): ProductData[] {
  const products: ProductData[] = [];
  
  // Look for loan products
  const loanTypes = html.match(/Boliglån|Fast rente|Flytende rente|Refinansiering/gi) || [];
  const rates = html.match(/(\d+[.,]\d+)\s*%/gi) || [];
  
  loanTypes.forEach((type, index) => {
    products.push({
      name: type.trim(),
      url: baseUrl,
      price: rates[index] || 'Se rente',
      description: `Sparebank 1 ${type} - boliglån`
    });
  });

  return products;
}

function parseGenericProducts(html: string, baseUrl: string): ProductData[] {
  // Generic fallback parsing
  const products: ProductData[] = [];
  
  const titles = html.match(/<h[1-6][^>]*>([^<]+)</gi) || [];
  const prices = html.match(/(\d+)\s*kr|(\d+[.,]\d+)\s*%/gi) || [];
  
  titles.slice(0, 5).forEach((title, index) => {
    const cleanTitle = title.replace(/<[^>]*>/g, '').trim();
    if (cleanTitle.length > 3) {
      products.push({
        name: cleanTitle,
        url: baseUrl,
        price: prices[index] || 'Se pris',
        description: cleanTitle
      });
    }
  });

  return products;
}
