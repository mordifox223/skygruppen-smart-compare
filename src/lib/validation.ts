
// Data validation utilities for provider information
export const validateProviderData = (provider: any): boolean => {
  const requiredFields = ['name', 'price', 'offerUrl', 'features'];
  return requiredFields.every(field => provider[field] !== undefined && provider[field] !== null);
};

export const validatePriceFormat = (price: number, category: string): boolean => {
  if (typeof price !== 'number' || price <= 0) return false;
  
  // Category-specific price validation
  switch (category) {
    case 'mobile':
      return price >= 99 && price <= 999; // Monthly mobile plans
    case 'electricity':
      return price >= 0.5 && price <= 2.0; // Per kWh rates
    case 'insurance':
      return price >= 500 && price <= 10000; // Annual insurance
    case 'loan':
      return price >= 1.0 && price <= 25.0; // Interest rates
    default:
      return true;
  }
};

export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

export const isUrlValid = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidLogo = (src: string, category: string, name: string): boolean => {
  // Basic URL validation
  if (!src || typeof src !== 'string') return false;
  
  // Check if it's a valid URL
  if (!isUrlValid(src)) return false;
  
  // Check for common image extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
  const hasImageExtension = imageExtensions.some(ext => 
    src.toLowerCase().includes(ext)
  );
  
  // Check if it's a data URL (base64 image)
  const isDataUrl = src.startsWith('data:image/');
  
  // Check if it's from a CDN or known image hosting service
  const knownImageHosts = ['cdn.', 'images.', 'img.', 'static.', 'assets.'];
  const isFromImageHost = knownImageHosts.some(host => 
    src.toLowerCase().includes(host)
  );
  
  return hasImageExtension || isDataUrl || isFromImageHost;
};
