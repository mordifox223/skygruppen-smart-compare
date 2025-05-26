
export interface NorwegianCompanyData {
  organisasjonsnummer: string;
  navn: string;
  forretningsadresse?: {
    adresse: string[];
    poststed: string;
    postnummer: string;
  };
  naeringskode1?: {
    kode: string;
    beskrivelse: string;
  };
  hjemmeside?: string;
  telefonnummer?: string;
  epost?: string;
  peppolId?: string;
  canReceiveEhf?: boolean;
}

export class NorwegianApiService {
  /**
   * Fetch company data from Brønnøysundregistrene
   */
  static async fetchFromBrreg(orgNumber: string): Promise<NorwegianCompanyData | null> {
    try {
      console.log(`🏢 Fetching data from Brønnøysund for org.nr: ${orgNumber}`);
      
      const response = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${orgNumber}`);
      
      if (!response.ok) {
        console.warn(`❌ Brønnøysund API returned ${response.status} for ${orgNumber}`);
        return null;
      }

      const data = await response.json();
      
      return {
        organisasjonsnummer: data.organisasjonsnummer,
        navn: data.navn,
        forretningsadresse: data.forretningsadresse,
        naeringskode1: data.naeringskode1,
        hjemmeside: data.hjemmeside
      };
    } catch (error) {
      console.error(`❌ Error fetching from Brønnøysund for ${orgNumber}:`, error);
      return null;
    }
  }

  /**
   * Check if company is PEPPOL participant (can receive EHF invoices)
   */
  static async checkPeppolParticipant(orgNumber: string): Promise<{ canReceiveEhf: boolean; peppolId?: string }> {
    try {
      console.log(`📄 Checking PEPPOL status for org.nr: ${orgNumber}`);
      
      // Try ELMA lookup
      const response = await fetch(`https://lookup.peppol.eu/participants/${orgNumber}:9908`);
      
      if (response.ok) {
        const data = await response.json();
        return {
          canReceiveEhf: true,
          peppolId: data.participantId || `${orgNumber}:9908`
        };
      }
      
      return { canReceiveEhf: false };
    } catch (error) {
      console.error(`❌ Error checking PEPPOL for ${orgNumber}:`, error);
      return { canReceiveEhf: false };
    }
  }

  /**
   * Search for company by name in Brønnøysund
   */
  static async searchByName(companyName: string): Promise<NorwegianCompanyData[]> {
    try {
      console.log(`🔍 Searching for company: ${companyName}`);
      
      const encodedName = encodeURIComponent(companyName);
      const response = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter?navn=${encodedName}&size=5`);
      
      if (!response.ok) {
        console.warn(`❌ Search failed for ${companyName}`);
        return [];
      }

      const data = await response.json();
      
      return data._embedded?.enheter?.map((enhet: any) => ({
        organisasjonsnummer: enhet.organisasjonsnummer,
        navn: enhet.navn,
        forretningsadresse: enhet.forretningsadresse,
        naeringskode1: enhet.naeringskode1,
        hjemmeside: enhet.hjemmeside
      })) || [];
    } catch (error) {
      console.error(`❌ Error searching for ${companyName}:`, error);
      return [];
    }
  }

  /**
   * Get comprehensive company data from multiple Norwegian APIs
   */
  static async getComprehensiveData(identifier: string): Promise<NorwegianCompanyData | null> {
    let companyData: NorwegianCompanyData | null = null;

    // Try as org number first
    if (/^\d{9}$/.test(identifier)) {
      companyData = await this.fetchFromBrreg(identifier);
      
      if (companyData) {
        // Enhance with PEPPOL data
        const peppolData = await this.checkPeppolParticipant(identifier);
        companyData.canReceiveEhf = peppolData.canReceiveEhf;
        companyData.peppolId = peppolData.peppolId;
      }
    } else {
      // Search by name
      const searchResults = await this.searchByName(identifier);
      if (searchResults.length > 0) {
        companyData = searchResults[0]; // Take first match
        
        // Enhance with PEPPOL data
        const peppolData = await this.checkPeppolParticipant(companyData.organisasjonsnummer);
        companyData.canReceiveEhf = peppolData.canReceiveEhf;
        companyData.peppolId = peppolData.peppolId;
      }
    }

    return companyData;
  }

  /**
   * Generate realistic pricing data based on company size and industry
   */
  static generateRealisticPricing(companyData: NorwegianCompanyData, category: string): number {
    // Base pricing on industry code and company characteristics
    const industryCode = companyData.naeringskode1?.kode;
    
    let basePrice = 299; // Default base price
    
    // Adjust pricing based on industry
    if (industryCode) {
      const code = parseInt(industryCode);
      
      // Technology/telecom companies - higher prices
      if (code >= 58 && code <= 63) basePrice = 450;
      // Financial services - premium pricing
      else if (code >= 64 && code <= 66) basePrice = 550;
      // Energy sector - mid-high pricing
      else if (code >= 35 && code <= 39) basePrice = 380;
      // Insurance - high pricing
      else if (code >= 65 && code <= 66) basePrice = 520;
    }
    
    // Add category-specific adjustments
    const categoryMultipliers = {
      mobile: 1.0,
      electricity: 0.8,
      insurance: 1.3,
      loan: 0.6
    };
    
    const multiplier = categoryMultipliers[category as keyof typeof categoryMultipliers] || 1.0;
    
    // Add some randomness for realism
    const variation = 0.8 + Math.random() * 0.4; // 80% to 120%
    
    return Math.round(basePrice * multiplier * variation);
  }
}
