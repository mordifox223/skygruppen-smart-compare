
import React, { useState, useEffect } from 'react';
import { DynamicProviderService, DynamicPlan } from '@/lib/services/dynamicProviderService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Globe, Smartphone, Clock, DollarSign, Wifi } from 'lucide-react';

interface UserNeeds {
  dataUsage: 'light' | 'heavy' | 'unlimited';
  tripDuration: number;
  isEuUser: boolean;
  supportsEsim: boolean;
  budget?: number;
  currency: 'NOK' | 'USD' | 'EUR';
}

const SmartRecommendations: React.FC = () => {
  const [userNeeds, setUserNeeds] = useState<UserNeeds>({
    dataUsage: 'heavy',
    tripDuration: 30,
    isEuUser: true,
    supportsEsim: true,
    currency: 'NOK'
  });
  
  const [recommendations, setRecommendations] = useState<DynamicPlan[]>([]);
  const [loading, setLoading] = useState(false);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const recs = await DynamicProviderService.getSmartRecommendations(userNeeds);
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateRecommendations();
  }, []);

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'NOK' ? 'kr' : currency === 'USD' ? '$' : '€';
    return `${symbol}${price}`;
  };

  const getCurrencySymbol = (currency: string) => {
    return currency === 'NOK' ? 'kr' : currency === 'USD' ? '$' : '€';
  };

  return (
    <div className="space-y-6">
      {/* User Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Smart Recommendations for Norway
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Data Usage</label>
              <select 
                value={userNeeds.dataUsage}
                onChange={(e) => setUserNeeds({...userNeeds, dataUsage: e.target.value as any})}
                className="w-full p-2 border rounded-md"
              >
                <option value="light">Light (3-5GB)</option>
                <option value="heavy">Heavy (10GB+)</option>
                <option value="unlimited">Unlimited</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Trip Duration (days)</label>
              <input
                type="number"
                value={userNeeds.tripDuration}
                onChange={(e) => setUserNeeds({...userNeeds, tripDuration: parseInt(e.target.value)})}
                className="w-full p-2 border rounded-md"
                min="1"
                max="365"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Budget ({getCurrencySymbol(userNeeds.currency)})</label>
              <input
                type="number"
                value={userNeeds.budget || ''}
                onChange={(e) => setUserNeeds({...userNeeds, budget: e.target.value ? parseInt(e.target.value) : undefined})}
                className="w-full p-2 border rounded-md"
                placeholder="Optional"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={userNeeds.isEuUser}
                onChange={(e) => setUserNeeds({...userNeeds, isEuUser: e.target.checked})}
              />
              <span>EU/EEA User (need roaming)</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={userNeeds.supportsEsim}
                onChange={(e) => setUserNeeds({...userNeeds, supportsEsim: e.target.checked})}
              />
              <span>Device supports eSIM</span>
            </label>
          </div>
          
          <Button onClick={generateRecommendations} disabled={loading}>
            {loading ? 'Generating...' : 'Get Smart Recommendations'}
          </Button>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Recommended Plans for Norway (2025)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((plan, index) => (
              <Card key={plan.id} className={`relative ${index === 0 ? 'ring-2 ring-blue-500' : ''}`}>
                {index === 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-blue-500">
                    Best Value
                  </Badge>
                )}
                
                {plan.isPromotion && (
                  <Badge className="absolute -top-2 -left-2 bg-red-500">
                    Promotion
                  </Badge>
                )}
                
                <CardHeader>
                  <CardTitle className="text-lg">{plan.providerName}</CardTitle>
                  <p className="text-sm text-gray-600">{plan.planName}</p>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(plan.price, plan.currency)}
                    <span className="text-sm font-normal text-gray-500">
                      / {plan.validityDays} days
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Wifi className="h-4 w-4" />
                      <span>{plan.dataAllowance}</span>
                      <Badge variant="outline">{plan.networkType}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{plan.validityDays} days validity</span>
                    </div>
                    
                    {plan.isEsim && (
                      <div className="flex items-center gap-2 text-sm">
                        <Smartphone className="h-4 w-4" />
                        <span>eSIM - Instant activation</span>
                      </div>
                    )}
                    
                    {plan.hasEuRoaming && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4" />
                        <span>EU roaming included</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    {plan.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="text-xs text-gray-600 flex items-start">
                        <span className="text-green-500 mr-1">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full" size="sm">
                    Get This Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {recommendations.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No recommendations found. Try adjusting your preferences.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartRecommendations;
