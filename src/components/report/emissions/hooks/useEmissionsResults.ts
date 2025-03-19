
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useFormValueUpdater } from './useFormValueUpdater';
import { EmissionsResults, EmissionsDetails, EmissionCalculationLogs } from '@/hooks/emissions-calculator';
import { safeJsonStringify } from '@/integrations/supabase/utils/jsonUtils';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for handling emissions calculation results
 */
export const useEmissionsResults = (
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void),
  reportId?: string
) => {
  const { toast } = useToast();
  const { updateFormValues } = useFormValueUpdater(setFormValues);
  const [calculationLogs, setCalculationLogs] = useState<EmissionCalculationLogs>({
    scope1Calculations: [],
    scope2Calculations: [],
    scope3Calculations: []
  });
  
  const handleCalculationResults = async (results: EmissionsResults, details: EmissionsDetails) => {
    // Update form values with the new calculation results
    updateFormValues('totalScope1Emissions', results.scope1.toFixed(2));
    updateFormValues('scope1CalculationDetails', details.scope1Details);
    updateFormValues('totalScope2Emissions', results.scope2.toFixed(2));
    updateFormValues('scope2CalculationDetails', details.scope2Details);
    updateFormValues('totalScope3Emissions', results.scope3.toFixed(2));
    updateFormValues('scope3CalculationDetails', details.scope3Details);
    updateFormValues('totalScopeEmissions', results.total.toFixed(2));
    
    // If reportId is provided, save directly to the database
    if (reportId) {
      try {
        const { error } = await supabase
          .from('emissions_data')
          .upsert({
            report_id: reportId,
            scope1_emissions: parseFloat(results.scope1.toFixed(2)),
            scope2_emissions: parseFloat(results.scope2.toFixed(2)),
            scope3_emissions: parseFloat(results.scope3.toFixed(2)),
            total_emissions: parseFloat(results.total.toFixed(2)),
            scope1_details: details.scope1Details ? safeJsonStringify(details.scope1Details) : null,
            scope2_details: details.scope2Details ? safeJsonStringify(details.scope2Details) : null,
            scope3_details: details.scope3Details ? safeJsonStringify(details.scope3Details) : null,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'report_id'
          });
        
        if (error) {
          throw error;
        }
        
        console.log("Emissions data saved to database successfully");
      } catch (error) {
        console.error("Error saving emissions data:", error);
        toast({
          title: "Errore",
          description: "Impossibile salvare i dati delle emissioni",
          variant: "destructive"
        });
      }
    }
  };

  const handleCalculationLogs = async (logs: EmissionCalculationLogs) => {
    setCalculationLogs(logs);
    
    // Ensure logs are properly stringified for storage
    const logsString = safeJsonStringify(logs);
    console.log("Storing calculation logs as string:", logsString.substring(0, 100) + "...");
    updateFormValues('emissionCalculationLogs', logsString);
    
    // If reportId is provided, save directly to the database
    if (reportId) {
      try {
        const { error } = await supabase
          .from('emissions_logs')
          .upsert({
            report_id: reportId,
            calculation_logs: logsString,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'report_id'
          });
        
        if (error) {
          throw error;
        }
        
        console.log("Emission calculation logs saved to database successfully");
      } catch (error) {
        console.error("Error saving emission calculation logs:", error);
        toast({
          title: "Errore",
          description: "Impossibile salvare i log di calcolo delle emissioni",
          variant: "destructive"
        });
      }
    }
  };

  // Function to explicitly reset all emissions values
  const resetEmissionsValues = async () => {
    // Clear all cache by resetting values to defaults
    updateFormValues('totalScope1Emissions', '0');
    updateFormValues('scope1CalculationDetails', '');
    updateFormValues('totalScope2Emissions', '0');
    updateFormValues('scope2CalculationDetails', '');
    updateFormValues('totalScope3Emissions', '0');
    updateFormValues('scope3CalculationDetails', '');
    updateFormValues('totalScopeEmissions', '0');
    
    // Clear calculation logs
    const emptyLogs = {
      scope1Calculations: [],
      scope2Calculations: [],
      scope3Calculations: []
    };
    updateFormValues('emissionCalculationLogs', safeJsonStringify(emptyLogs));
    setCalculationLogs(emptyLogs);
    
    // If reportId is provided, delete records from the database
    if (reportId) {
      try {
        // Delete emissions data
        await supabase
          .from('emissions_data')
          .delete()
          .eq('report_id', reportId);
        
        // Delete emissions logs
        await supabase
          .from('emissions_logs')
          .delete()
          .eq('report_id', reportId);
        
        console.log("Emissions data and logs deleted from database successfully");
      } catch (error) {
        console.error("Error deleting emissions data:", error);
        toast({
          title: "Errore",
          description: "Impossibile eliminare i dati delle emissioni",
          variant: "destructive"
        });
      }
    }
    
    // Clear localStorage cache related to emissions
    try {
      const cacheKeys = Object.keys(localStorage).filter(key => 
        key.includes('emissions') || 
        key.includes('scope') || 
        key.includes('calculation')
      );
      
      cacheKeys.forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error("Error clearing localStorage cache:", error);
    }
  };

  return { 
    handleCalculationResults,
    handleCalculationLogs,
    calculationLogs,
    setCalculationLogs, // Export the setter
    resetEmissionsValues 
  };
};
