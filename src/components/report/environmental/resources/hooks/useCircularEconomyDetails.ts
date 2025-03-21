
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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
        .select('recycled_content, recyclable_content, resources_details')
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
            updated_at: new Date().toISOString()
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
            resources_details: newDetails.resourcesDetails
          });
      }
      
      if (result.error) throw result.error;
      
      // Aggiorna lo stato locale
      setDetails(newDetails);
      
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
    saveDetails
  };
};
