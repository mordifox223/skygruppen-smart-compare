
import { Provider, ProviderCategory } from '../types';

export interface HealthCheck {
  providerId: string;
  category: ProviderCategory;
  lastUpdated: Date;
  isHealthy: boolean;
  errorCount: number;
  lastError?: string;
}

export class SelfHealingManager {
  private healthChecks = new Map<string, HealthCheck>();
  private maxRetries = 3;
  private retryDelay = 2000;

  async validateProvider(provider: Provider): Promise<boolean> {
    try {
      // Check if offer URL is still valid
      const urlValid = await this.checkURL(provider.offerUrl || provider.url);
      
      // Check data consistency
      const dataValid = this.validateProviderData(provider);
      
      // Check if price seems reasonable for category
      const priceValid = this.validatePrice(provider);
      
      const isHealthy = urlValid && dataValid && priceValid;
      
      this.updateHealthCheck(provider.id, provider.category, isHealthy);
      
      return isHealthy;
    } catch (error) {
      console.error(`Validation failed for ${provider.name}:`, error);
      this.updateHealthCheck(provider.id, provider.category, false, error.message);
      return false;
    }
  }

  private async checkURL(url: string): Promise<boolean> {
    try {
      // In production, this would make a HEAD request to check if URL is accessible
      // For now, just validate URL format and domain
      const urlObj = new URL(url);
      const validDomains = [
        'telia.no', 'telenor.no', 'ice.no', 'onecall.no', // mobile
        'tibber.no', 'fortum.no', 'fjordkraft.no', // electricity
        'gjensidige.no', 'tryg.no', 'fremtind.no', // insurance
        'dnb.no', 'nordea.no', 'sparebank1.no' // loans
      ];
      
      return validDomains.some(domain => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  }

  private validateProviderData(provider: Provider): boolean {
    return !!(
      provider.name &&
      provider.price > 0 &&
      provider.rating >= 0 && provider.rating <= 5 &&
      provider.features &&
      (provider.features.nb?.length > 0 || provider.features.en?.length > 0)
    );
  }

  private validatePrice(provider: Provider): boolean {
    const categoryRanges = {
      mobile: { min: 100, max: 800 },
      electricity: { min: 0.5, max: 3.0 },
      insurance: { min: 800, max: 5000 },
      loan: { min: 1.5, max: 15.0 }
    };
    
    const range = categoryRanges[provider.category];
    return provider.price >= range.min && provider.price <= range.max;
  }

  private updateHealthCheck(providerId: string, category: ProviderCategory, isHealthy: boolean, error?: string): void {
    const existing = this.healthChecks.get(providerId);
    
    this.healthChecks.set(providerId, {
      providerId,
      category,
      lastUpdated: new Date(),
      isHealthy,
      errorCount: isHealthy ? 0 : (existing?.errorCount || 0) + 1,
      lastError: error
    });
  }

  getHealthStatus(providerId: string): HealthCheck | undefined {
    return this.healthChecks.get(providerId);
  }

  getUnhealthyProviders(): HealthCheck[] {
    return Array.from(this.healthChecks.values()).filter(check => !check.isHealthy);
  }

  async retryWithBackoff<T>(fn: () => Promise<T>, context: string): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        console.warn(`${context} attempt ${attempt} failed:`, error.message);
        
        if (attempt < this.maxRetries) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }
}

export const selfHealingManager = new SelfHealingManager();
