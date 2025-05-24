
import React, { useState, useMemo } from 'react';
import { Provider } from '@/lib/types';
import { useLanguage } from '@/lib/languageContext';
import { rankProviders, RankedProvider } from '@/lib/core/comparisonEngine';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Trophy, Zap, ExternalLink } from 'lucide-react';
import { buildAffiliateLink, logClick } from '@/lib/affiliate';
import ProviderLogo from '@/components/ProviderLogo';

interface ComparisonEngineProps {
  providers: Provider[];
  categoryId: string;
}

const ComparisonEngine: React.FC<ComparisonEngineProps> = ({ providers, categoryId }) => {
  const { language } = useLanguage();
  const [sortBy, setSortBy] = useState<'score' | 'price' | 'rating'>('score');
  
  const rankedProviders = useMemo(() => {
    const ranked = rankProviders(providers, categoryId);
    
    switch (sortBy) {
      case 'price':
        return ranked.sort((a, b) => a.price - b.price);
      case 'rating':
        return ranked.sort((a, b) => b.rating - a.rating);
      default:
        return ranked; // Already sorted by score
    }
  }, [providers, categoryId, sortBy]);

  const handleProviderClick = async (provider: RankedProvider) => {
    await logClick(provider.id, provider.name, provider.category);
    window.open(buildAffiliateLink(provider), '_blank', 'noopener,noreferrer');
  };

  const getRankingIcon = (ranking: number) => {
    if (ranking === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (ranking === 2) return <Trophy className="w-5 h-5 text-gray-400" />;
    if (ranking === 3) return <Trophy className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-slate-600">#{ranking}</span>;
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
        <span className="text-sm text-slate-600 ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Sort Controls */}
      <div className="flex gap-2 bg-white p-4 rounded-lg shadow-sm">
        <span className="text-sm font-montserrat font-semibold text-slate-900 mr-3">
          {language === 'nb' ? 'Sorter etter:' : 'Sort by:'}
        </span>
        {[
          { key: 'score', label: language === 'nb' ? 'Beste verdi' : 'Best value' },
          { key: 'price', label: language === 'nb' ? 'Laveste pris' : 'Lowest price' },
          { key: 'rating', label: language === 'nb' ? 'Høyest rating' : 'Highest rating' }
        ].map(({ key, label }) => (
          <Button
            key={key}
            variant={sortBy === key ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy(key as typeof sortBy)}
            className={sortBy === key ? "bg-sky-600 hover:bg-sky-700" : ""}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rankedProviders.map((provider) => (
          <Card key={provider.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            {/* Ranking Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
              {getRankingIcon(provider.ranking)}
              {provider.ranking <= 3 && (
                <Badge variant="secondary" className="bg-slate-900 text-white font-montserrat">
                  {language === 'nb' ? 'Topp 3' : 'Top 3'}
                </Badge>
              )}
            </div>

            <div className="p-6 pt-16">
              {/* Provider Header */}
              <div className="flex items-center gap-3 mb-4">
                <ProviderLogo provider={provider} size="md" />
                <div>
                  <h3 className="font-montserrat font-semibold text-lg text-slate-900">{provider.name}</h3>
                  {renderRating(provider.rating)}
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="text-3xl font-montserrat font-bold text-sky-600">
                  {provider.price} 
                  <span className="text-base font-normal text-slate-600 ml-1">
                    {provider.priceLabel[language]}
                  </span>
                </div>
                {provider.score > 0 && (
                  <div className="text-sm text-slate-500">
                    {language === 'nb' ? 'Verdi-score:' : 'Value score:'} {Math.round(provider.score)}/100
                  </div>
                )}
              </div>

              {/* Key Features */}
              <div className="mb-6">
                <h4 className="font-montserrat font-semibold text-sm text-slate-700 mb-2">
                  {language === 'nb' ? 'Viktige funksjoner:' : 'Key features:'}
                </h4>
                <div className="space-y-2">
                  {provider.keyFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Zap size={14} className="text-sky-600 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => handleProviderClick(provider)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-montserrat flex items-center justify-center gap-2"
              >
                {language === 'nb' ? 'Velg tilbud' : 'Select offer'}
                <ExternalLink size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Info Banner */}
      <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 text-center">
        <p className="text-sky-800 text-sm">
          {language === 'nb' 
            ? `Sammenligner ${rankedProviders.length} leverandører. Data oppdateres hver time for nøyaktige priser.`
            : `Comparing ${rankedProviders.length} providers. Data updated hourly for accurate pricing.`
          }
        </p>
      </div>
    </div>
  );
};

export default ComparisonEngine;
