
export interface ScrapedProduct {
  provider: string;
  logo: string;
  product: string;
  price: string;
  data?: string;
  speed?: string;
  binding?: string;
  benefits: string[];
  link: string;
  category: 'mobile' | 'electricity' | 'insurance' | 'loan';
}

export interface ProviderConfig {
  name: string;
  baseUrl: string;
  category: 'mobile' | 'electricity' | 'insurance' | 'loan';
  selectors: {
    productList: string;
    productName: string;
    price: string;
    data?: string;
    speed?: string;
    benefits?: string;
    link: string;
  };
  logoUrl?: string;
}
