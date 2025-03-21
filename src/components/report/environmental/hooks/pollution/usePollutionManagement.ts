
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UsePollutionManagementProps {
  reportId: string | undefined;
}

export const usePollutionManagement = ({ reportId }: UsePollutionManagementProps) => {
  const [details, setDetails] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Load pollution management details
  useEffect(() => {
    if (reportId) {
      loadDetails();
    }
  }, [reportId]);

  // Load details from the database
  const loadDetails = async () => {
    if (!reportId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pollution_management_details')
        .select('details')
        .eq('report_id', reportId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "row not found" error
        throw error;
      }
      
      if (data) {
        setDetails(data.details || '');
      }
    } catch (error) {
      console.error('Error loading pollution management details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save details to the database
  const saveDetails = async (newDetails: string): Promise<boolean> => {
    if (!reportId) return false;
    
    setIsSaving(true);
    try {
      // Check if record exists
      const { data: existingData } = await supabase
        .from('pollution_management_details')
        .select('id')
        .eq('report_id', reportId)
        .single();
      
      let result;
      
      if (existingData) {
        // Update existing record
        result = await supabase
          .from('pollution_management_details')
          .update({
            details: newDetails,
            updated_at: new Date().toISOString()
          })
          .eq('report_id', reportId);
      } else {
        // Insert new record
        result = await supabase
          .from('pollution_management_details')
          .insert({
            report_id: reportId,
            details: newDetails
          });
      }
      
      if (result.error) throw result.error;
      
      // Update local state
      setDetails(newDetails);
      
      toast({
        title: "Salvato con successo",
        description: "I dettagli sul sistema di gestione degli inquinanti sono stati salvati",
      });
      
      return true;
    } catch (error) {
      console.error('Error saving pollution management details:', error);
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
