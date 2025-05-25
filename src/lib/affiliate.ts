
import { Provider } from './types';
import { isUrlValid } from './validation';

// Enhanced affiliate link building with better URL targeting
export const buildAffiliateLink = (provider: Provider): string => {
  try {
    // Always prioritize offerUrl over base url for specific offers
    let targetUrl = provider.offerUrl || provider.url;
    
    // Validate the target URL first
    if (!isUrlValid(targetUrl)) {
      console.error(`Invalid offer URL for provider ${provider.name}:`, targetUrl);
      // Fallback to base URL if offer URL is invalid
      targetUrl = provider.url;
      if (!isUrlValid(targetUrl)) {
        console.error(`Invalid base URL for provider ${provider.name}:`, targetUrl);
        return provider.url;
      }
    }

    const url = new URL(targetUrl);
    
    // Add Skygruppen tracking parameters for commission tracking
    url.searchParams.set('ref', 'skygruppen');
    url.searchParams.set('partner', 'skycompare');
    url.searchParams.set('utm_source', 'skycompare');
    url.searchParams.set('utm_medium', 'comparison');
    url.searchParams.set('utm_campaign', provider.category);
    url.searchParams.set('utm_content', provider.id);
    
    // Add timestamp for unique tracking
    url.searchParams.set('utm_term', Date.now().toString());
    
    // Category-specific URL enhancements for better targeting
    switch (provider.category) {
      case 'mobile':
        // Ensure mobile plans land on subscription pages
        if (!url.pathname.includes('abonnement') && !url.pathname.includes('mobilabonnement')) {
          url.searchParams.set('landing', 'mobile_plans');
        }
        break;
      case 'electricity':
        // Ensure electricity providers land on order/signup pages
        if (!url.pathname.includes('bestill') && !url.pathname.includes('strom')) {
          url.searchParams.set('landing', 'electricity_order');
        }
        break;
      case 'insurance':
        // Ensure insurance providers land on quote/offer pages
        if (!url.pathname.includes('forsikring') && !url.pathname.includes('tilbud')) {
          url.searchParams.set('landing', 'insurance_quote');
        }
        break;
      case 'loan':
        // Ensure loan providers land on application pages
        if (!url.pathname.includes('laan') && !url.pathname.includes('soknad')) {
          url.searchParams.set('landing', 'loan_application');
        }
        break;
    }
    
    console.log(`Built affiliate link for ${provider.name}:`, url.toString());
    return url.toString();
  } catch (error) {
    console.error('Failed to build affiliate link for', provider.name, ':', error);
    // Return the best available URL as fallback
    return provider.offerUrl || provider.url;
  }
};

// Enhanced click logging with better tracking data
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
      session_id: generateSessionId(),
      target_url: null as string | null
    };

    // Get the actual target URL that was built
    const providers = JSON.parse(localStorage.getItem('cached_providers') || '[]');
    const provider = providers.find((p: Provider) => p.id === providerId);
    if (provider) {
      clickData.target_url = buildAffiliateLink(provider);
    }

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

// Validate provider offer URLs with enhanced checking
export const validateProviderOffers = async (providers: Provider[]): Promise<Provider[]> => {
  const validatedProviders = await Promise.all(
    providers.map(async (provider) => {
      try {
        // Validate both base URL and offer URL
        const isBaseUrlValid = isUrlValid(provider.url);
        const isOfferUrlValid = provider.offerUrl ? isUrlValid(provider.offerUrl) : true;
        
        // Check if offer URL is more specific than base URL
        const hasSpecificOfferUrl = provider.offerUrl && provider.offerUrl !== provider.url;
        
        let validationStatus = 'valid';
        if (!isBaseUrlValid) {
          validationStatus = 'invalid_base_url';
        } else if (!isOfferUrlValid) {
          validationStatus = 'invalid_offer_url';
        } else if (!hasSpecificOfferUrl) {
          validationStatus = 'missing_specific_offer';
        }
        
        return {
          ...provider,
          isValidData: isBaseUrlValid && isOfferUrlValid,
          validationStatus,
          hasSpecificOffer: hasSpecificOfferUrl,
          lastUpdated: provider.lastUpdated || new Date()
        };
      } catch (error) {
        console.error(`Validation failed for ${provider.name}:`, error);
        return {
          ...provider,
          isValidData: false,
          validationStatus: 'validation_error',
          hasSpecificOffer: false,
          lastUpdated: provider.lastUpdated || new Date()
        };
      }
    })
  );
  
  // Log validation summary
  const invalidProviders = validatedProviders.filter(p => !p.isValidData);
  const missingOffers = validatedProviders.filter(p => !p.hasSpecificOffer);
  
  if (invalidProviders.length > 0) {
    console.warn('Providers with invalid URLs:', invalidProviders.map(p => `${p.name} (${p.validationStatus})`));
  }
  
  if (missingOffers.length > 0) {
    console.info('Providers missing specific offer URLs:', missingOffers.map(p => p.name));
  }
  
  return validatedProviders;
};

// Test affiliate link generation for debugging
export const testAffiliateLinks = (providers: Provider[]): void => {
  console.group('Testing affiliate links:');
  providers.forEach(provider => {
    const affiliateLink = buildAffiliateLink(provider);
    console.log(`${provider.name}:`, {
      baseUrl: provider.url,
      offerUrl: provider.offerUrl,
      affiliateLink,
      isSpecific: provider.offerUrl !== provider.url
    });
  });
  console.groupEnd();
};
