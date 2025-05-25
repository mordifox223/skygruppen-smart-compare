import { Provider } from './types';
import { isUrlValid } from './validation';

// Enhanced affiliate link building with validation
export const buildAffiliateLink = (provider: Provider): string => {
  try {
    // Validate the base URL first
    if (!isUrlValid(provider.offerUrl || provider.url)) {
      console.error(`Invalid URL for provider ${provider.name}:`, provider.offerUrl || provider.url);
      return provider.url; // Fallback to base URL
    }

    const baseUrl = provider.offerUrl || provider.url;
    const url = new URL(baseUrl);
    
    // Add tracking parameters
    url.searchParams.set('ref', 'skygruppen');
    url.searchParams.set('utm_source', 'skycompare');
    url.searchParams.set('utm_medium', 'comparison');
    url.searchParams.set('utm_campaign', provider.category);
    url.searchParams.set('utm_content', provider.id);
    
    // Add timestamp for tracking
    url.searchParams.set('utm_term', Date.now().toString());
    
    return url.toString();
  } catch (error) {
    console.error('Failed to build affiliate link for', provider.name, ':', error);
    return provider.url;
  }
};

// Enhanced click logging with better data validation
export const logClick = async (providerId: string, providerName: string, category: string): Promise<void> => {
  try {
    const clickData = {
      provider_id: providerId,
      provider_name: providerName,
      category,
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      session_id: generateSessionId()
    };

    console.log('Affiliate click logged:', clickData);
    
    // Store in localStorage with validation
    const existingClicks = getStoredClicks();
    existingClicks.push(clickData);
    
    // Keep only last 200 clicks and remove older ones
    const recentClicks = existingClicks.slice(-200);
    localStorage.setItem('affiliate_clicks', JSON.stringify(recentClicks));
    
  } catch (error) {
    console.error('Failed to log affiliate click:', error);
  }
};

// Generate unique session ID for better tracking
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get stored clicks with validation
const getStoredClicks = (): any[] => {
  try {
    const stored = localStorage.getItem('affiliate_clicks');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Enhanced analytics with better data structure
export const getClickAnalytics = (): any[] => {
  const clicks = getStoredClicks();
  
  // Add some basic analytics processing
  return clicks.map(click => ({
    ...click,
    date: new Date(click.timestamp).toLocaleDateString('nb-NO'),
    time: new Date(click.timestamp).toLocaleTimeString('nb-NO')
  }));
};

// Validate provider offer URLs
export const validateProviderOffers = async (providers: Provider[]): Promise<Provider[]> => {
  const validatedProviders = await Promise.all(
    providers.map(async (provider) => {
      try {
        // Basic URL validation
        const isValidUrl = isUrlValid(provider.offerUrl || provider.url);
        
        return {
          ...provider,
          isValidData: isValidUrl,
          lastUpdated: provider.lastUpdated || new Date()
        };
      } catch (error) {
        console.error(`Validation failed for ${provider.name}:`, error);
        return {
          ...provider,
          isValidData: false,
          lastUpdated: provider.lastUpdated || new Date()
        };
      }
    })
  );
  
  return validatedProviders;
};
