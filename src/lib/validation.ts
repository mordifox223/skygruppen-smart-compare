
import { z } from 'zod';
import { ProviderCategory } from './types';

// Zod schema for strict provider data validation
export const ProviderSchema = z.object({
  name: z.string().min(2),
  price: z.number().positive(),
  offerUrl: z.string().url().refine(url => isValidOfferPath(url)),
  lastUpdated: z.date(),
  features: z.record(z.string(), z.union([z.string(), z.number()])),
  logo: z.string().url().optional(),
  rating: z.number().min(0).max(5).optional()
});

// Validate offer URLs for different categories
export const isValidOfferPath = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();
    
    // Check for known Norwegian provider domains
    const validDomains = [
      'gjensidige.no', 'tryg.no', 'fremtind.no', 'storebrand.no', // insurance
      'tibber.no', 'fortum.no', 'fjordkraft.no', 'lyse.no', // electricity  
      'telenor.no', 'telia.no', 'ice.no', 'talkmore.no', // mobile
      'dnb.no', 'nordea.no', 'sparebank1.no', 'danske.no' // banking
    ];
    
    return validDomains.some(validDomain => domain.includes(validDomain));
  } catch {
    return false;
  }
};

// Logo validation with category-specific patterns
export const isValidLogo = (url: string, category: ProviderCategory, providerName: string): boolean => {
  if (!url) return false;
  
  const validExtensions = /\.(png|svg|webp|ico)(\?.*)?$/i;
  const isValidUrl = /^https?:\/\//.test(url);
  
  if (!isValidUrl || !validExtensions.test(url)) return false;
  
  // Category-specific validation patterns
  const categoryPatterns = {
    electricity: /tibber|fortum|fjordkraft|lyse|norgesenergi/i,
    mobile: /telenor|telia|ice|talkmore|chili/i,
    insurance: /gjensidige|tryg|fremtind|storebrand/i,
    loan: /dnb|nordea|sparebank|danske|sbanken/i
  };
  
  const pattern = categoryPatterns[category];
  return !pattern || pattern.test(url) || url.toLowerCase().includes(providerName.toLowerCase());
};

// Retry utility with exponential backoff and jitter
export const retry = async <T>(
  fn: () => Promise<T>, 
  retries = 3,
  baseDelay = 1000
): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      
      // Exponential backoff with jitter
      const delay = Math.min(baseDelay * 2 ** i + Math.random() * 500, 30000);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('Retry failed');
};
