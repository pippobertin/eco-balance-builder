
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useReport } from '@/hooks/use-report-context';

interface CircularEconomyDetails {
  recycledContent: number | null;
  recyclableContent: number | null;
  resourcesDetails: string | null;
}

export const useCircularEconomyDetails = (reportId: string | undefined) => {
  const [details, setDetails] = useState<CircularEconomyDetails>({
    recycledContent: null,
    recyclableContent: null,
    resourcesDetails: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();
  const { setLastSaved: setGlobalLastSaved } = useReport();

  // Carica i dettagli dell'economia circolare
  useEffect(() => {
    if (reportId) {
      loadDetails();
    }
  }, [reportId]);

  const loadDetails = async () => {
    if (!reportId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('circular_economy_details')
        .select('recycled_content, recyclable_content, resources_details, updated_at')
        .eq('report_id', reportId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "row not found" error
        throw error;
      }
      
      if (data) {
        setDetails({
          recycledContent: data.recycled_content,
          recyclableContent: data.recyclable_content,
          resourcesDetails: data.resources_details
        });
        
        if (data.updated_at) {
          setLastSaved(new Date(data.updated_at));
        }
      }
    } catch (error) {
      console.error('Error loading circular economy details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDetails = async (newDetails: CircularEconomyDetails): Promise<boolean> => {
    if (!reportId) return false;
    
    setIsSaving(true);
    try {
      const now = new Date();
      const isoDate = now.toISOString();
      
      // Controlla se il record esiste
      const { data: existingData } = await supabase
        .from('circular_economy_details')
        .select('id')
        .eq('report_id', reportId)
        .maybeSingle();
      
      let result;
      
      if (existingData) {
        // Aggiorna il record esistente
        result = await supabase
          .from('circular_economy_details')
          .update({
            recycled_content: newDetails.recycledContent,
            recyclable_content: newDetails.recyclableContent,
            resources_details: newDetails.resourcesDetails,
            updated_at: isoDate
          })
          .eq('report_id', reportId);
      } else {
        // Inserisci un nuovo record
        result = await supabase
          .from('circular_economy_details')
          .insert({
            report_id: reportId,
            recycled_content: newDetails.recycledContent,
            recyclable_content: newDetails.recyclableContent,
            resources_details: newDetails.resourcesDetails,
            updated_at: isoDate
          });
      }
      
      if (result.error) throw result.error;
      
      // Aggiorna lo stato locale
      setDetails(newDetails);
      
      // Update both local and global timestamps
      setLastSaved(now);
      setGlobalLastSaved(now);
      
      toast({
        title: "Salvato con successo",
        description: "I dettagli sull'economia circolare sono stati salvati",
      });
      
      return true;
    } catch (error) {
      console.error('Error saving circular economy details:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio dei dettagli",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    details,
    setDetails,
    isLoading,
    isSaving,
    saveDetails,
    lastSaved
  };
};
