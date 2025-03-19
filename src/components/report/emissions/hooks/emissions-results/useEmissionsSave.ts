
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EmissionCalculationLogs } from '@/hooks/emissions-calculator/types';
import { safeJsonStringify } from '@/integrations/supabase/utils/jsonUtils';

export const useEmissionsSave = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Function to save calculation logs to database
  const saveCalculationLogs = async (reportId: string, logs: EmissionCalculationLogs) => {
    try {
      console.log('Saving calculation logs:', logs);
      const { data, error } = await supabase
        .from('emissions_logs')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      const logsJson = safeJsonStringify(logs);
      console.log('Stringified logs:', logsJson);

      if (data) {
        // Update existing logs
        await supabase
          .from('emissions_logs')
          .update({
            calculation_logs: logsJson,
            updated_at: new Date().toISOString()
          })
          .eq('report_id', reportId);
      } else {
        // Insert new logs
        await supabase
          .from('emissions_logs')
          .insert({
            report_id: reportId,
            calculation_logs: logsJson,
            updated_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error saving calculation logs:', error);
      throw error;
    }
  };

  // Function to save emissions data to both the report and a separate table
  const saveEmissions = async (
    reportId: string,
    scope1: number,
    scope2: number,
    scope3: number,
    calculationLogs: EmissionCalculationLogs
  ) => {
    if (!reportId) {
      console.error('Cannot save emissions: reportId is undefined');
      setIsSaving(false);
      return null;
    }

    setIsSaving(true);
    
    try {
      const total = scope1 + scope2 + scope3;
      console.log(`Saving emissions - Scope1: ${scope1}, Scope2: ${scope2}, Scope3: ${scope3}, Total: ${total}`);
      
      // Check if a record exists
      const { data, error: fetchError } = await supabase
        .from('emissions_data')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
        
      if (fetchError) throw fetchError;
      
      // Update emissions data table - using numeric values as per database schema
      const emissionsData = {
        scope1_emissions: scope1,
        scope2_emissions: scope2,
        scope3_emissions: scope3,
        total_emissions: total,
        updated_at: new Date().toISOString()
      };
      
      let updateError;
      
      if (data) {
        // Update existing record
        const { error } = await supabase
          .from('emissions_data')
          .update(emissionsData)
          .eq('report_id', reportId);
          
        updateError = error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('emissions_data')
          .insert({
            ...emissionsData,
            report_id: reportId
          });
          
        updateError = error;
      }

      if (updateError) throw updateError;

      console.log('Emissions data saved successfully');

      // Also save the calculation logs
      await saveCalculationLogs(reportId, calculationLogs);

      toast({
        title: 'Emissioni salvate',
        description: 'I calcoli delle emissioni sono stati salvati con successo',
      });

      return { scope1, scope2, scope3, total };
    } catch (error) {
      console.error('Error saving emissions:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile salvare i calcoli delle emissioni',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    saveEmissions
  };
};
