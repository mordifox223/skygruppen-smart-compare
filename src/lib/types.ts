
export type Language = 'nb' | 'en';

export interface Category {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  icon: string; // This will be the name of the icon from lucide-react
  providers: number; // Number of providers in this category
}

export interface Provider {
  id: string;
  name: string;
  category: string;
  logo: string;
  price: number;
  priceLabel: Record<Language, string>;
  rating: number;
  features: Record<Language, string[]>;
  url: string;
}

export interface ComparisonFilters {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy: 'price' | 'rating' | 'name';
  sortDirection: 'asc' | 'desc';
}
