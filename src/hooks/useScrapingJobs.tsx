
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ScrapingJob {
  id: string;
  provider_name: string;
  category: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string | null;
  completed_at: string | null;
  results_count: number;
  error_message: string | null;
  execution_time_ms: number | null;
  created_at: string;
}

export const useScrapingJobs = () => {
  return useQuery({
    queryKey: ['scraping-jobs'],
    queryFn: async (): Promise<ScrapingJob[]> => {
      const { data, error } = await supabase
        .from('scraping_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('Error fetching scraping jobs:', error);
        throw error;
      }
      
      // Transform the data to match our interface
      return (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'running' | 'completed' | 'failed'
      }));
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useCreateScrapingJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (job: { provider_name: string; category: string }) => {
      const { data, error } = await supabase
        .from('scraping_jobs')
        .insert([{ ...job, status: 'pending' }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scraping-jobs'] });
    }
  });
};
