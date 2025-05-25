
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { providerDataService } from '@/lib/services/providerDataService';

interface UrlValidatorProps {
  urls: string[];
  category?: string;
  onValidationComplete?: (results: { url: string; valid: boolean }[]) => void;
}

const UrlValidator: React.FC<UrlValidatorProps> = ({ urls, category, onValidationComplete }) => {
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
        // Enhanced URL validation with timeout
        const isValid = await validateUrlWithTimeout(url, 5000);
        results.push({ url, valid: isValid });
        
        // Update individual result as it completes
        setValidationResults(prev => 
          prev.map(r => r.url === url ? { ...r, valid: isValid, testing: false } : r)
        );
      } catch (error) {
        console.error(`Validation failed for ${url}:`, error);
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

  const validateUrlWithTimeout = async (url: string, timeout: number): Promise<boolean> => {
    return new Promise(async (resolve) => {
      const timeoutId = setTimeout(() => resolve(false), timeout);
      
      try {
        const response = await fetch(url, { 
          method: 'HEAD', 
          mode: 'no-cors',
          cache: 'no-cache'
        });
        clearTimeout(timeoutId);
        resolve(true);
      } catch (error) {
        clearTimeout(timeoutId);
        resolve(false);
      }
    });
  };

  const validateCategoryUrls = async () => {
    if (!category) return;
    
    try {
      setIsValidating(true);
      const results = await providerDataService.validateAffiliateUrls(category);
      
      const formattedResults = results.map(r => ({
        url: r.url,
        valid: r.valid,
        testing: false
      }));
      
      setValidationResults(formattedResults);
      
      if (onValidationComplete) {
        onValidationComplete(results.map(r => ({ url: r.url, valid: r.valid })));
      }
    } catch (error) {
      console.error('Failed to validate category URLs:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const addUrl = () => {
    if (newUrl && !urls.includes(newUrl)) {
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

  const validCount = validationResults.filter(r => r.valid && !r.testing).length;
  const invalidCount = validationResults.filter(r => !r.valid && !r.testing).length;
  const completedCount = validationResults.filter(r => !r.testing).length;

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
        {category && (
          <Button onClick={validateCategoryUrls} disabled={isValidating} variant="secondary">
            Test {category}
          </Button>
        )}
      </div>

      {/* Enhanced validation summary */}
      {validationResults.length > 0 && (
        <div className="p-3 bg-gray-50 rounded border">
          <div className="text-sm font-medium mb-2">Validation Results:</div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <CheckCircle size={16} className="text-green-600 mr-1" />
              <span>{validCount} Valid</span>
            </div>
            <div className="flex items-center">
              <XCircle size={16} className="text-red-600 mr-1" />
              <span>{invalidCount} Invalid</span>
            </div>
            <div className="flex items-center">
              <AlertTriangle size={16} className="text-yellow-600 mr-1" />
              <span>{completedCount}/{urls.length} Tested</span>
            </div>
          </div>
        </div>
      )}

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
                  className="text-blue-600 hover:underline text-sm break-all"
                >
                  {url}
                </a>
              </div>
              {result && getStatusBadge(result)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UrlValidator;
