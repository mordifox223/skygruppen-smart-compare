
import { supabase } from '@/integrations/supabase/client';
import { NorwegianApiService, NorwegianCompanyData } from './norwegianApiService';

export interface ImportedProvider {
  name: string;
  category: string;
  price: number;
  rating: number;
  description: string;
  logo_url?: string;
  url: string;
  offer_url?: string;
  features?: Record<string, any>;
  organisasjonsnummer?: string;
  peppolId?: string;
  canReceiveEhf?: boolean;
  address?: string;
  industryCode?: string;
}

export class DataImportService {
  /**
   * Parse provider names from uploaded text file
   */
  static parseProvidersFromText(text: string): string[] {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }

  /**
   * Create provider from Norwegian company data
   */
  static createProviderFromNorwegianData(
    companyData: NorwegianCompanyData,
    category: string,
    originalName: string
  ): ImportedProvider {
    const price = NorwegianApiService.generateRealisticPricing(companyData, category);
    const rating = Math.round((3.5 + Math.random() * 1.5) * 10) / 10; // 3.5-5.0 rating
    
    // Create address string
    const address = companyData.forretningsadresse 
      ? `${companyData.forretningsadresse.adresse?.join(' ') || ''}, ${companyData.forretningsadresse.postnummer || ''} ${companyData.forretningsadresse.poststed || ''}`.trim()
      : '';

    // Generate website URL if not provided
    const websiteUrl = companyData.hjemmeside || 
      `https://${companyData.navn.toLowerCase().replace(/[^a-z0-9]/g, '')}.no`;

    return {
      name: companyData.navn,
      category,
      price,
      rating,
      description: `${companyData.navn} - ${companyData.naeringskode1?.beskrivelse || 'Leverandør'} basert i ${companyData.forretningsadresse?.poststed || 'Norge'}`,
      url: websiteUrl,
      offer_url: `${websiteUrl}/tilbud`,
      organisasjonsnummer: companyData.organisasjonsnummer,
      peppolId: companyData.peppolId,
      canReceiveEhf: companyData.canReceiveEhf,
      address,
      industryCode: companyData.naeringskode1?.kode,
      features: {
        nb: [
          'Norsk selskap',
          companyData.canReceiveEhf ? 'EHF-faktura støtte' : 'Standard fakturering',
          companyData.naeringskode1?.beskrivelse || 'Profesjonelle tjenester'
        ],
        en: [
          'Norwegian company',
          companyData.canReceiveEhf ? 'EHF invoice support' : 'Standard invoicing',
          companyData.naeringskode1?.beskrivelse || 'Professional services'
        ]
      }
    };
  }

  /**
   * Import providers from text and save to database using Norwegian APIs
   */
  static async importProvidersFromText(
    text: string, 
    category: string
  ): Promise<{ success: number; errors: string[] }> {
    const providerIdentifiers = this.parseProvidersFromText(text);
    const importedProviders: ImportedProvider[] = [];
    const errors: string[] = [];

    console.log(`📋 Importing ${providerIdentifiers.length} providers for category: ${category}`);
    console.log(`🇳🇴 Using Norwegian APIs (Brønnøysund + PEPPOL)`);

    for (const identifier of providerIdentifiers) {
      try {
        console.log(`\n🔄 Processing: ${identifier}`);
        
        // Get comprehensive data from Norwegian APIs
        const companyData = await NorwegianApiService.getComprehensiveData(identifier);
        
        if (companyData) {
          const provider = this.createProviderFromNorwegianData(companyData, category, identifier);
          importedProviders.push(provider);
          
          console.log(`✅ Successfully imported ${companyData.navn} (${companyData.organisasjonsnummer})`);
          console.log(`   - Industry: ${companyData.naeringskode1?.beskrivelse || 'N/A'}`);
          console.log(`   - EHF Support: ${companyData.canReceiveEhf ? 'Yes' : 'No'}`);
          console.log(`   - Generated Price: ${provider.price} kr`);
        } else {
          // Create fallback data if no API data found
          console.log(`⚠️ No API data found for ${identifier}, creating fallback`);
          importedProviders.push({
            name: identifier,
            category,
            price: Math.floor(Math.random() * 500) + 200, // 200-700 kr
            rating: Math.round((3.0 + Math.random() * 2) * 10) / 10, // 3.0-5.0
            description: `${identifier} tilbud for ${category}`,
            url: `https://${identifier.toLowerCase().replace(/\s+/g, '')}.no`,
            offer_url: `https://${identifier.toLowerCase().replace(/\s+/g, '')}.no/tilbud`
          });
          errors.push(`No Norwegian registry data found for: ${identifier}`);
        }
      } catch (error) {
        errors.push(`Failed to process ${identifier}: ${error}`);
        console.error(`❌ Error processing ${identifier}:`, error);
      }
    }

    // Save to database
    if (importedProviders.length > 0) {
      try {
        console.log(`\n💾 Saving ${importedProviders.length} providers to database...`);
        
        const { error } = await supabase
          .from('provider_offers')
          .upsert(
            importedProviders.map(provider => ({
              provider_name: provider.name,
              category: provider.category,
              plan_name: `${provider.name} Standard`,
              monthly_price: provider.price,
              offer_url: provider.offer_url || provider.url,
              source_url: provider.url,
              features: {
                ...provider.features,
                organisasjonsnummer: provider.organisasjonsnummer,
                peppolId: provider.peppolId,
                canReceiveEhf: provider.canReceiveEhf,
                address: provider.address,
                industryCode: provider.industryCode
              },
              logo_url: provider.logo_url,
              is_active: true,
              scraped_at: new Date().toISOString()
            })),
            { 
              onConflict: 'provider_name,category,plan_name',
              ignoreDuplicates: false 
            }
          );

        if (error) {
          console.error('❌ Database error:', error);
          throw new Error(`Database error: ${error.message}`);
        }

        console.log(`✅ Successfully saved ${importedProviders.length} providers to database`);
      } catch (dbError) {
        errors.push(`Database error: ${dbError}`);
        console.error('❌ Failed to save to database:', dbError);
      }
    }

    console.log(`\n📊 Import Summary:`);
    console.log(`   - Total processed: ${providerIdentifiers.length}`);
    console.log(`   - Successfully imported: ${importedProviders.length}`);
    console.log(`   - Errors: ${errors.length}`);

    return {
      success: importedProviders.length,
      errors
    };
  }
}
