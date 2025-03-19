
import { useEffect } from 'react';
import { EmissionsInput, EmissionsResults, EmissionCalculationLogs } from '@/hooks/emissions-calculator';
import { safeJsonParse } from '@/integrations/supabase/utils/jsonUtils';

export const useExistingEmissions = (
  formValues: any,
  updateInput: (key: keyof EmissionsInput, value: any) => void,
  resetCalculation: () => void,
  setCalculatedEmissions?: (results: EmissionsResults) => void,
  setCalculationLogs?: (logs: EmissionCalculationLogs) => void
) => {
  // Effect to load existing emissions data from formValues
  useEffect(() => {
    if (!formValues || !formValues.environmentalMetrics) {
      console.log("No form values or environmental metrics available");
      return;
    }
    
    try {
      // Extract emission values from the form
      const { 
        totalScope1Emissions, 
        totalScope2Emissions, 
        totalScope3Emissions, 
        totalScopeEmissions,
        emissionCalculationLogs
      } = formValues.environmentalMetrics;
      
      console.log("Loading existing emissions data:", { 
        totalScope1Emissions, 
        totalScope2Emissions, 
        totalScope3Emissions 
      });
      
      // Only update if we have values and they are not already loaded
      if (
        totalScope1Emissions || 
        totalScope2Emissions || 
        totalScope3Emissions
      ) {
        // Parse the values to numbers, handling different types
        const scope1 = parseFloat(String(totalScope1Emissions || '0'));
        const scope2 = parseFloat(String(totalScope2Emissions || '0'));
        const scope3 = parseFloat(String(totalScope3Emissions || '0'));
        const total = parseFloat(String(totalScopeEmissions || '0'));
        
        // Update the calculated emissions state if available
        if (setCalculatedEmissions) {
          const emissionsResults = {
            scope1: isNaN(scope1) ? 0 : scope1,
            scope2: isNaN(scope2) ? 0 : scope2,
            scope3: isNaN(scope3) ? 0 : scope3,
            total: isNaN(total) ? (scope1 + scope2 + scope3) : total
          };
          
          console.log("Setting calculated emissions:", emissionsResults);
          setCalculatedEmissions(emissionsResults);
        }
      }
      
      // Get calculation logs from formValues if available
      if (emissionCalculationLogs && setCalculationLogs) {
        try {
          console.log("Parsing logs in useExistingEmissions");
          let parsedLogs: EmissionCalculationLogs;
          
          // Handle the case where logs could be a string, object, or other type
          parsedLogs = safeJsonParse(emissionCalculationLogs, {
            scope1Calculations: [],
            scope2Calculations: [],
            scope3Calculations: []
          });
          
          // Ensure the structure is complete
          if (!parsedLogs.scope1Calculations) parsedLogs.scope1Calculations = [];
          if (!parsedLogs.scope2Calculations) parsedLogs.scope2Calculations = [];
          if (!parsedLogs.scope3Calculations) parsedLogs.scope3Calculations = [];
          
          console.log("Loaded calculation logs:", JSON.stringify(parsedLogs));
          
          // Set calculation logs state if available
          setCalculationLogs(parsedLogs);
        } catch (error) {
          console.error("Error parsing emission calculation logs:", error);
        }
      }
    } catch (error) {
      console.error("Error loading existing emissions:", error);
    }
  }, [formValues?.environmentalMetrics, setCalculatedEmissions, setCalculationLogs]);
};
