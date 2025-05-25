
import { supabase } from '@/integrations/supabase/client';

export interface FunctionTestResult {
  functionName: string;
  status: 'success' | 'error';
  responseTime: number;
  data?: any;
  error?: string;
}

export const testAllFunctions = async (): Promise<FunctionTestResult[]> => {
  const functions = [
    'scrape-real-providers',
    'fetch-providers', 
    'scrape-providers',
    'scrape-live-products'
  ];

  const results: FunctionTestResult[] = [];

  for (const functionName of functions) {
    const startTime = Date.now();
    
    try {
      console.log(`🧪 Testing function: ${functionName}`);
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { action: 'health_check' }
      });

      const responseTime = Date.now() - startTime;

      if (error) {
        results.push({
          functionName,
          status: 'error',
          responseTime,
          error: error.message
        });
      } else {
        results.push({
          functionName,
          status: 'success',
          responseTime,
          data
        });
      }
    } catch (err: any) {
      const responseTime = Date.now() - startTime;
      results.push({
        functionName,
        status: 'error',
        responseTime,
        error: err.message
      });
    }

    // Add delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return results;
};

export const testSpecificFunction = async (functionName: string, body: any = {}): Promise<FunctionTestResult> => {
  const startTime = Date.now();
  
  try {
    console.log(`🧪 Testing specific function: ${functionName}`, body);
    
    const { data, error } = await supabase.functions.invoke(functionName, { body });
    const responseTime = Date.now() - startTime;

    if (error) {
      return {
        functionName,
        status: 'error',
        responseTime,
        error: error.message
      };
    }

    return {
      functionName,
      status: 'success',
      responseTime,
      data
    };
  } catch (err: any) {
    const responseTime = Date.now() - startTime;
    return {
      functionName,
      status: 'error',
      responseTime,
      error: err.message
    };
  }
};
