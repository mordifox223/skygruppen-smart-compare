
import { Provider } from './types';

// Generates tracked URLs with deep links
export const buildAffiliateLink = (provider: Provider): string => {
  try {
    const url = new URL(provider.offerUrl || provider.url);
    url.searchParams.set('ref', 'skycompare');
    url.searchParams.set('utm_source', 'skygruppen');
    url.searchParams.set('utm_medium', 'comparison');
    url.searchParams.set('utm_campaign', provider.category);
    return url.toString();
  } catch (error) {
    console.error('Failed to build affiliate link:', error);
    return provider.url;
  }
};

// Logs click with full context
export const logClick = async (providerId: string, providerName: string, category: string): Promise<void> => {
  try {
    // In production, this would log to Supabase
    const clickData = {
      provider_id: providerId,
      provider_name: providerName,
      category,
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    console.log('Affiliate click logged:', clickData);
    
    // Simulate API call (replace with actual Supabase insert)
    // await supabase.from('affiliate_clicks').insert(clickData);
    
    // Track in localStorage as fallback
    const existingClicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '[]');
    existingClicks.push(clickData);
    localStorage.setItem('affiliate_clicks', JSON.stringify(existingClicks.slice(-100))); // Keep last 100
    
  } catch (error) {
    console.error('Failed to log affiliate click:', error);
  }
};

// Get click analytics (for admin dashboard)
export const getClickAnalytics = (): any[] => {
  try {
    return JSON.parse(localStorage.getItem('affiliate_clicks') || '[]');
  } catch {
    return [];
  }
};
