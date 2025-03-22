import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StrategyAPIData, StrategyFormData } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useStrategyLoad = (
  reportId: string,
  setFormData: React.Dispatch<React.SetStateAction<StrategyFormData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      if (!reportId) return;
      
      try {
        setIsLoading(true);
        console.log("Loading strategy data for report:", reportId);
        
        // First, check if we have duplicate entries and clean them up
        const { data: allEntries, error: countError } = await supabase
          .from('narrative_strategy')
          .select('*')
          .eq('report_id', reportId);
          
        if (countError) {
          console.error("Error checking strategy entries:", countError);
        } else if (allEntries && allEntries.length > 1) {
          // Keep only the most recent entry and delete the rest
          const sortedEntries = [...allEntries].sort((a, b) => 
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
          
          const latestEntry = sortedEntries[0];
          
          // Delete older entries
          for (let i = 1; i < sortedEntries.length; i++) {
            await supabase
              .from('narrative_strategy')
              .delete()
              .eq('id', sortedEntries[i].id);
          }
          
          // Use the latest entry data
          const apiData = latestEntry as StrategyAPIData;
          setFormData({
            productsServices: apiData.products_services || '',
            markets: apiData.markets || '',
            businessRelations: apiData.business_relations || '',
            sustainabilityStrategy: apiData.sustainability_strategy || ''
          });
          
          if (apiData.updated_at) {
            setLastSaved(new Date(apiData.updated_at));
          }
          
          setIsLoading(false);
          return;
        }
        
        // Normal case - fetch single entry
        const { data, error } = await supabase
          .from('narrative_strategy')
          .select('*')
          .eq('report_id', reportId)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "row not found" error
          throw error;
        }
        
        if (data) {
          console.log("Strategy data loaded:", data);
          const apiData = data as StrategyAPIData;
          setFormData({
            productsServices: apiData.products_services || '',
            markets: apiData.markets || '',
            businessRelations: apiData.business_relations || '',
            sustainabilityStrategy: apiData.sustainability_strategy || ''
          });
          
          if (apiData.updated_at) {
            setLastSaved(new Date(apiData.updated_at));
          }
        } else {
          console.log("No strategy data found for report ID:", reportId);
          // Reset to empty values if no data found
          setFormData({
            productsServices: '',
            markets: '',
            businessRelations: '',
            sustainabilityStrategy: ''
          });
          setLastSaved(null);
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
  }, [reportId, setFormData, setIsLoading, setLastSaved, toast]);
};
