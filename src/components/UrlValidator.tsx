
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { realDataService } from '@/lib/services/realDataService';

interface UrlValidatorProps {
  urls: string[];
  onValidationComplete?: (results: { url: string; valid: boolean }[]) => void;
}

const UrlValidator: React.FC<UrlValidatorProps> = ({ urls, onValidationComplete }) => {
  const [validationResults, setValidationResults] = useState<{ url: string; valid: boolean; testing: boolean }[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [newUrl, setNewUrl] = useState('');

  const validateUrls = async () => {
    setIsValidating(true);
    const results = [];
    
    // Initialize results with testing state
    const initialResults = urls.map(url => ({ url, valid: false, testing: true }));
    setValidationResults(initialResults);

    for (const url of urls) {
      try {
        const isValid = await realDataService.validateAffiliateUrl(url);
        results.push({ url, valid: isValid });
        
        // Update individual result as it completes
        setValidationResults(prev => 
          prev.map(r => r.url === url ? { ...r, valid: isValid, testing: false } : r)
        );
      } catch (error) {
        results.push({ url, valid: false });
        setValidationResults(prev => 
          prev.map(r => r.url === url ? { ...r, valid: false, testing: false } : r)
        );
      }
    }

    setIsValidating(false);
    if (onValidationComplete) {
      onValidationComplete(results);
    }
  };

  const addUrl = () => {
    if (newUrl && !urls.includes(newUrl)) {
      // This would need to be handled by parent component
      console.log('Add URL:', newUrl);
      setNewUrl('');
    }
  };

  const getStatusBadge = (result: { valid: boolean; testing: boolean }) => {
    if (result.testing) {
      return <Badge variant="secondary"><RefreshCw className="animate-spin" size={12} /> Testing</Badge>;
    }
    return result.valid 
      ? <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle size={12} /> Valid</Badge>
      : <Badge variant="destructive"><XCircle size={12} /> Invalid</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Legg til ny URL for testing..."
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
        />
        <Button onClick={addUrl} variant="outline">
          Legg til
        </Button>
        <Button onClick={validateUrls} disabled={isValidating || urls.length === 0}>
          {isValidating ? <RefreshCw className="animate-spin mr-2" size={16} /> : null}
          Valider alle
        </Button>
      </div>

      <div className="space-y-2">
        {urls.map((url, index) => {
          const result = validationResults.find(r => r.url === url);
          return (
            <div key={index} className="flex items-center justify-between p-3 border rounded">
              <div className="flex-1 mr-3">
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {url}
                </a>
              </div>
              {result && getStatusBadge(result)}
            </div>
          );
        })}
      </div>

      {validationResults.length > 0 && (
        <div className="text-sm text-gray-600">
          Validerte: {validationResults.filter(r => !r.testing).length} / {urls.length}
          {validationResults.length > 0 && (
            <span className="ml-2">
              ✓ {validationResults.filter(r => r.valid && !r.testing).length} fungerer, 
              ✗ {validationResults.filter(r => !r.valid && !r.testing).length} feilet
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default UrlValidator;
