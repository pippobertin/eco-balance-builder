
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EmissionCalculationLogs, EmissionCalculationRecord } from '@/hooks/emissions-calculator/types';
import { safeJsonParse, safeJsonStringify } from '@/integrations/supabase/utils/jsonUtils';

export const useEmissionsResults = (reportId: string | undefined) => {
  const { toast } = useToast();
  const [scope1Emissions, setScope1Emissions] = useState<number>(0);
  const [scope2Emissions, setScope2Emissions] = useState<number>(0);
  const [scope3Emissions, setScope3Emissions] = useState<number>(0);
  const [totalEmissions, setTotalEmissions] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing emissions data when component mounts
  useEffect(() => {
    if (reportId) {
      loadEmissionsData(reportId);
    }
  }, [reportId]);

  // Function to load emissions data from database
  const loadEmissionsData = async (reportId: string) => {
    setIsLoading(true);
    try {
      console.log(`Loading emissions data for report: ${reportId}`);
      const { data, error } = await supabase
        .from('emissions_data')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();

      if (error) {
        console.error('Error loading emissions data:', error);
        return;
      }

      // If data exists, update the state
      if (data) {
        console.log('Emissions data loaded successfully:', data);
        setScope1Emissions(parseFloat(data.scope1_emissions) || 0);
        setScope2Emissions(parseFloat(data.scope2_emissions) || 0);
        setScope3Emissions(parseFloat(data.scope3_emissions) || 0);
        setTotalEmissions(parseFloat(data.total_emissions) || 0);
      } else {
        console.log('No emissions data found for report:', reportId);
        // Initialize with zeros
        resetEmissions();
        
        // Create an initial entry in the database
        const emissionsData = {
          report_id: reportId,
          scope1_emissions: 0, // Use numeric values as per database schema
          scope2_emissions: 0, // Use numeric values as per database schema
          scope3_emissions: 0, // Use numeric values as per database schema
          total_emissions: 0,  // Use numeric values as per database schema
          updated_at: new Date().toISOString()
        };
        
        const { error: insertError } = await supabase
          .from('emissions_data')
          .insert(emissionsData);
          
        if (insertError) {
          console.error('Error creating initial emissions data:', insertError);
        }
      }
    } catch (error) {
      console.error('Error in loadEmissionsData:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to save calculation logs to database
  const saveCalculationLogs = async (reportId: string, logs: EmissionCalculationLogs) => {
    try {
      const { data, error } = await supabase
        .from('emissions_logs')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      const logsJson = safeJsonStringify(logs);

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
      return;
    }

    setIsSaving(true);
    
    try {
      const total = scope1 + scope2 + scope3;
      
      // Check if a record exists
      const { data, error: fetchError } = await supabase
        .from('emissions_data')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
        
      if (fetchError) throw fetchError;
      
      // Update emissions data table - use numeric values as per database schema
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

      // Also save the calculation logs
      await saveCalculationLogs(reportId, calculationLogs);

      // Update local state
      setScope1Emissions(scope1);
      setScope2Emissions(scope2);
      setScope3Emissions(scope3);
      setTotalEmissions(total);

      toast({
        title: 'Emissioni salvate',
        description: 'I calcoli delle emissioni sono stati salvati con successo',
      });
    } catch (error) {
      console.error('Error saving emissions:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile salvare i calcoli delle emissioni',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Function to reset emissions data
  const resetEmissions = () => {
    setScope1Emissions(0);
    setScope2Emissions(0);
    setScope3Emissions(0);
    setTotalEmissions(0);
  };

  return {
    scope1Emissions,
    scope2Emissions,
    scope3Emissions,
    totalEmissions,
    isLoading,
    isSaving,
    saveEmissions,
    resetEmissions
  };
};
