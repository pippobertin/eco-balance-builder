
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StrategyAPIData, StrategyFormData } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useStrategyLoad = (
  reportId: string,
  setFormData: React.Dispatch<React.SetStateAction<StrategyFormData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Query the database for strategy data
        const { data, error } = await supabase
          .from('narrative_strategy')
          .select('*')
          .eq('report_id', reportId)
          .maybeSingle();

        if (error) {
          throw error;
        }

        // If data exists, update the form data
        if (data) {
          const apiData = data as StrategyAPIData;
          setFormData({
            productsServices: apiData.products_services || '',
            markets: apiData.markets || '',
            businessRelations: apiData.business_relations || '',
            sustainabilityStrategy: apiData.sustainability_strategy || ''
          });
        }
      } catch (error: any) {
        console.error('Error loading strategy data:', error.message);
        toast({
          title: "Errore",
          description: `Impossibile caricare i dati della strategia: ${error.message}`,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (reportId) {
      loadData();
    }
  }, [reportId, setFormData, setIsLoading, toast]);
};
