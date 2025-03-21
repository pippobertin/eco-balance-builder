
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WorkforceCompensationData {
  entry_wage: number | null;
  local_minimum_wage: number | null;
  entry_wage_to_minimum_wage_ratio: number | null;
  gender_pay_gap: number | null;
  collective_bargaining_coverage: number | null;
  avg_training_hours_male: number | null;
  avg_training_hours_female: number | null;
}

export const useWorkforceCompensationData = (reportId: string | undefined) => {
  const [compensationData, setCompensationData] = useState<WorkforceCompensationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();

  const loadCompensationData = async () => {
    if (!reportId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Loading compensation data for report:", reportId);
      
      const { data, error } = await supabase
        .from('workforce_compensation')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        console.log("Compensation data loaded:", data);
        setCompensationData({
          entry_wage: data.entry_wage,
          local_minimum_wage: data.local_minimum_wage,
          entry_wage_to_minimum_wage_ratio: data.entry_wage_to_minimum_wage_ratio,
          gender_pay_gap: data.gender_pay_gap,
          collective_bargaining_coverage: data.collective_bargaining_coverage,
          avg_training_hours_male: data.avg_training_hours_male,
          avg_training_hours_female: data.avg_training_hours_female
        });
        
        // Set last saved date based on the updated_at field
        if (data.updated_at) {
          setLastSaved(new Date(data.updated_at));
        }
      } else {
        console.log("No compensation data found for this report");
        setCompensationData(null);
      }
    } catch (error: any) {
      console.error("Error loading compensation data:", error.message);
      toast({
        title: "Errore",
        description: `Impossibile caricare i dati di retribuzione: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveCompensationData = async (data: WorkforceCompensationData) => {
    if (!reportId) {
      console.error("Report ID is undefined. Cannot save compensation data.");
      return;
    }
    
    setIsSaving(true);
    
    try {
      console.log("Saving compensation data:", data);
      
      const { data: existingData, error: checkError } = await supabase
        .from('workforce_compensation')
        .select('id')
        .eq('report_id', reportId)
        .maybeSingle();
      
      if (checkError) {
        throw checkError;
      }
      
      let result;
      
      if (existingData) {
        // Update existing record
        result = await supabase
          .from('workforce_compensation')
          .update({
            entry_wage: data.entry_wage,
            local_minimum_wage: data.local_minimum_wage,
            entry_wage_to_minimum_wage_ratio: data.entry_wage_to_minimum_wage_ratio,
            gender_pay_gap: data.gender_pay_gap,
            collective_bargaining_coverage: data.collective_bargaining_coverage,
            avg_training_hours_male: data.avg_training_hours_male,
            avg_training_hours_female: data.avg_training_hours_female,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
      } else {
        // Insert new record
        result = await supabase
          .from('workforce_compensation')
          .insert({
            report_id: reportId,
            entry_wage: data.entry_wage,
            local_minimum_wage: data.local_minimum_wage,
            entry_wage_to_minimum_wage_ratio: data.entry_wage_to_minimum_wage_ratio,
            gender_pay_gap: data.gender_pay_gap,
            collective_bargaining_coverage: data.collective_bargaining_coverage,
            avg_training_hours_male: data.avg_training_hours_male,
            avg_training_hours_female: data.avg_training_hours_female
          });
      }
      
      if (result.error) {
        throw result.error;
      }
      
      console.log("Compensation data saved successfully");
      toast({
        title: "Dati salvati",
        description: "Dati di retribuzione salvati con successo"
      });
      
      // Update last saved timestamp
      setLastSaved(new Date());
      
      // Reload data to ensure we have the latest version
      await loadCompensationData();
      
    } catch (error: any) {
      console.error("Error saving compensation data:", error.message);
      toast({
        title: "Errore",
        description: `Impossibile salvare i dati di retribuzione: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Load data when reportId changes
  useEffect(() => {
    loadCompensationData();
  }, [reportId]);

  return {
    compensationData,
    loading,
    loadCompensationData,
    saveCompensationData,
    isSaving,
    lastSaved
  };
};
