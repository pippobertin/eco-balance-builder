
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseSustainabilityPracticesProps {
  reportId?: string;
}

export const useSustainabilityPractices = ({ reportId }: UseSustainabilityPracticesProps) => {
  const [practices, setPractices] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { toast } = useToast();

  // Load sustainability practices when the report ID changes
  useEffect(() => {
    const loadPractices = async () => {
      if (!reportId) return;
      
      setIsLoading(true);
      try {
        console.log(`Loading sustainability practices for report: ${reportId}`);
        const { data, error } = await supabase
          .from('sustainability_practices')
          .select('practices_description')
          .eq('report_id', reportId)
          .single();
          
        if (error && error.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error
          console.error("Error loading sustainability practices:", error);
          toast({
            title: "Errore",
            description: "Impossibile caricare le pratiche per la sostenibilità",
            variant: "destructive"
          });
          return;
        }
        
        if (data) {
          console.log("Loaded sustainability practices:", data.practices_description);
          setPractices(data.practices_description || '');
        }
      } catch (error) {
        console.error("Exception loading sustainability practices:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPractices();
  }, [reportId, toast]);

  // Save sustainability practices
  const savePractices = async (practicesText: string): Promise<boolean> => {
    if (!reportId) {
      toast({
        title: "Errore",
        description: "Nessun report selezionato",
        variant: "destructive"
      });
      return false;
    }
    
    setIsSaving(true);
    try {
      console.log(`Saving sustainability practices for report: ${reportId}`);
      
      // Check if a record already exists
      const { data: existingData } = await supabase
        .from('sustainability_practices')
        .select('id')
        .eq('report_id', reportId)
        .maybeSingle();
      
      let result;
      
      if (existingData) {
        // Update existing record
        result = await supabase
          .from('sustainability_practices')
          .update({ 
            practices_description: practicesText,
            updated_at: new Date().toISOString()
          })
          .eq('report_id', reportId);
      } else {
        // Insert new record
        result = await supabase
          .from('sustainability_practices')
          .insert({ 
            report_id: reportId,
            practices_description: practicesText
          });
      }
      
      if (result.error) {
        console.error("Error saving sustainability practices:", result.error);
        toast({
          title: "Errore",
          description: "Impossibile salvare le pratiche per la sostenibilità",
          variant: "destructive"
        });
        return false;
      }
      
      setPractices(practicesText);
      toast({
        title: "Salvato",
        description: "Pratiche per la sostenibilità salvate con successo"
      });
      return true;
      
    } catch (error) {
      console.error("Exception saving sustainability practices:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    practices,
    setPractices,
    isLoading,
    isSaving,
    savePractices
  };
};
