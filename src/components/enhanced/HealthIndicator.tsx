
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { selfHealingManager } from '@/lib/core/selfHealing';
import { Provider } from '@/lib/types';
import { useLanguage } from '@/lib/languageContext';
import { Shield, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HealthIndicatorProps {
  provider: Provider;
  showDetails?: boolean;
}

const HealthIndicator: React.FC<HealthIndicatorProps> = ({ provider, showDetails = false }) => {
  const { language } = useLanguage();
  
  const { data: healthStatus, isLoading } = useQuery({
    queryKey: ['health', provider.id],
    queryFn: () => selfHealingManager.getHealthStatus(provider.id),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // 1 minute
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <RefreshCw size={14} className="animate-spin text-slate-400" />
        {showDetails && (
          <span className="text-xs text-slate-500">
            {language === 'nb' ? 'Sjekker...' : 'Checking...'}
          </span>
        )}
      </div>
    );
  }

  const isHealthy = !healthStatus || healthStatus.isHealthy;
  const hasErrors = healthStatus && healthStatus.errorCount > 0;

  const getStatusIcon = () => {
    if (isHealthy && !hasErrors) {
      return <CheckCircle size={14} className="text-green-500" />;
    }
    if (hasErrors) {
      return <AlertTriangle size={14} className="text-orange-500" />;
    }
    return <Shield size={14} className="text-slate-400" />;
  };

  const getStatusText = () => {
    if (isHealthy && !hasErrors) {
      return language === 'nb' ? 'Oppdatert' : 'Updated';
    }
    if (hasErrors) {
      return language === 'nb' ? 'Cache' : 'Cached';
    }
    return language === 'nb' ? 'Ukjent' : 'Unknown';
  };

  const getStatusColor = () => {
    if (isHealthy && !hasErrors) return 'bg-green-100 text-green-800';
    if (hasErrors) return 'bg-orange-100 text-orange-800';
    return 'bg-slate-100 text-slate-800';
  };

  return (
    <div className="flex items-center gap-2">
      {getStatusIcon()}
      {showDetails && (
        <Badge variant="secondary" className={`text-xs ${getStatusColor()}`}>
          {getStatusText()}
        </Badge>
      )}
      {showDetails && healthStatus && (
        <span className="text-xs text-slate-500">
          {new Date(healthStatus.lastUpdated).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

export default HealthIndicator;
