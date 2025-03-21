
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EmissionCalculationLogs } from '@/hooks/emissions-calculator/types';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export const useEmissionsSave = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const saveEmissions = async (
    reportId: string,
    scope1: number,
    scope2: number,
    scope3: number,
    calculationLogs: EmissionCalculationLogs
  ) => {
    setIsSaving(true);
    
    try {
      console.log('Saving emissions data for report:', reportId);
      console.log('Emissions values:', { scope1, scope2, scope3, total: scope1 + scope2 + scope3 });
      console.log('Calculation logs before save:', calculationLogs);
      console.log('Calculation logs structure:', {
        scope1Count: calculationLogs.scope1Calculations?.length || 0,
        scope2Count: calculationLogs.scope2Calculations?.length || 0,
        scope3Count: calculationLogs.scope3Calculations?.length || 0
      });
      
      // Ensure we have valid arrays for each scope
      const validatedLogs = {
        scope1Calculations: Array.isArray(calculationLogs.scope1Calculations) 
          ? calculationLogs.scope1Calculations : [],
        scope2Calculations: Array.isArray(calculationLogs.scope2Calculations)
          ? calculationLogs.scope2Calculations : [],
        scope3Calculations: Array.isArray(calculationLogs.scope3Calculations)
          ? calculationLogs.scope3Calculations : []
      };
      
      // Calculate total emissions
      const total = scope1 + scope2 + scope3;
      
      // Check if emissions data exists for this report
      const { data: existingData, error: checkError } = await supabase
        .from('emissions_logs')
        .select('id')
        .eq('report_id', reportId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') { // Not found error code
        throw new Error(checkError.message);
      }
      
      let result;
      
      // If data exists, update it
      if (existingData) {
        console.log('Updating existing emissions data with ID:', existingData.id);
        
        const { data, error } = await supabase
          .from('emissions_logs')
          .update({
            calculation_logs: validatedLogs as unknown as Json,
            updated_at: new Date().toISOString()
          })
          .eq('report_id', reportId)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating emissions data:', error);
          throw new Error(error.message);
        }
        result = data;
        console.log('Emissions data updated successfully:', result);
      } else {
        // If no data exists, create a new record
        console.log('Creating new emissions data record');
        
        const { data, error } = await supabase
          .from('emissions_logs')
          .insert({
            report_id: reportId,
            calculation_logs: validatedLogs as unknown as Json,
            created_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (error) {
          console.error('Error inserting emissions data:', error);
          throw new Error(error.message);
        }
        result = data;
        console.log('New emissions data created successfully:', result);
      }
      
      // Create the normalized result
      const normalizedResult = {
        scope1: scope1,
        scope2: scope2,
        scope3: scope3,
        total: total
      };
      
      toast({
        title: "Emissioni salvate",
        description: "I dati delle emissioni sono stati salvati con successo",
      });
      
      return normalizedResult;
    } catch (error: any) {
      console.error('Error saving emissions data:', error);
      
      toast({
        title: "Errore",
        description: `Impossibile salvare i dati delle emissioni: ${error.message}`,
        variant: "destructive"
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
