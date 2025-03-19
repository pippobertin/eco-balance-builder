
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EmissionsInput, EmissionsResults, EmissionCalculationLogs } from '@/hooks/emissions-calculator';
import { safeJsonParse } from '@/integrations/supabase/utils/jsonUtils';
import { useToast } from '@/hooks/use-toast';

export const useExistingEmissions = (
  formValues: any,
  updateInput: (key: keyof EmissionsInput, value: any) => void,
  resetCalculation: () => void,
  setCalculatedEmissions?: (results: EmissionsResults) => void,
  setCalculationLogs?: (logs: EmissionCalculationLogs) => void,
  reportId?: string
) => {
  const { toast } = useToast();
  
  // Effect to load existing emissions data directly from the database if reportId is provided
  useEffect(() => {
    if (reportId) {
      loadEmissionsDataFromDatabase(reportId);
    } else if (formValues && formValues.environmentalMetrics) {
      loadEmissionsDataFromFormValues();
    } else {
      console.log("No report ID or form values available for loading emissions data");
    }
  }, [reportId, formValues?.environmentalMetrics]);
  
  // Load emissions data from the database
  const loadEmissionsDataFromDatabase = async (reportId: string) => {
    try {
      // Fetch emissions data
      const { data: emissionsData, error: emissionsError } = await supabase
        .from('emissions_data')
        .select('*')
        .eq('report_id', reportId)
        .single();
      
      if (emissionsError) {
        if (emissionsError.code !== 'PGRST116') { // No data found is not a real error
          console.error("Error loading emissions data:", emissionsError);
          toast({
            title: "Errore",
            description: "Impossibile caricare i dati delle emissioni",
            variant: "destructive"
          });
        }
      }
      
      // Fetch emissions logs
      const { data: logsData, error: logsError } = await supabase
        .from('emissions_logs')
        .select('*')
        .eq('report_id', reportId)
        .single();
      
      if (logsError && logsError.code !== 'PGRST116') {
        console.error("Error loading emissions logs:", logsError);
      }
      
      if (emissionsData) {
        console.log("Loading emissions data from database:", {
          scope1: emissionsData.scope1_emissions,
          scope2: emissionsData.scope2_emissions,
          scope3: emissionsData.scope3_emissions
        });
        
        // Update the calculated emissions state if available
        if (setCalculatedEmissions) {
          const emissionsResults = {
            scope1: parseFloat(emissionsData.scope1_emissions) || 0,
            scope2: parseFloat(emissionsData.scope2_emissions) || 0,
            scope3: parseFloat(emissionsData.scope3_emissions) || 0,
            total: parseFloat(emissionsData.total_emissions) || 0
          };
          
          console.log("Setting calculated emissions:", emissionsResults);
          setCalculatedEmissions(emissionsResults);
        }
      }
      
      // Get calculation logs if available
      if (logsData && logsData.calculation_logs && setCalculationLogs) {
        try {
          console.log("Parsing logs from database");
          
          // Handle different potential data types for logs using our improved safeJsonParse
          const parsedLogs = safeJsonParse<EmissionCalculationLogs>(logsData.calculation_logs, {
            scope1Calculations: [],
            scope2Calculations: [],
            scope3Calculations: []
          });
          
          // Ensure the structure is complete
          if (!parsedLogs.scope1Calculations) parsedLogs.scope1Calculations = [];
          if (!parsedLogs.scope2Calculations) parsedLogs.scope2Calculations = [];
          if (!parsedLogs.scope3Calculations) parsedLogs.scope3Calculations = [];
          
          console.log("Loaded calculation logs from database");
          
          // Set calculation logs state if available
          setCalculationLogs(parsedLogs);
        } catch (error) {
          console.error("Error parsing emission calculation logs:", error);
        }
      }
    } catch (error) {
      console.error("Error loading emissions data from database:", error);
    }
  };
  
  // Fallback: Load emissions data from form values
  const loadEmissionsDataFromFormValues = () => {
    try {
      // Extract emission values from the form
      const { 
        totalScope1Emissions, 
        totalScope2Emissions, 
        totalScope3Emissions, 
        totalScopeEmissions,
        emissionCalculationLogs
      } = formValues.environmentalMetrics;
      
      console.log("Loading existing emissions data from form values:", { 
        totalScope1Emissions, 
        totalScope2Emissions, 
        totalScope3Emissions,
        emissionCalculationLogs: emissionCalculationLogs ? "Present" : "Not present"
      });
      
      // Only update if we have values and they are not already loaded
      if (
        totalScope1Emissions || 
        totalScope2Emissions || 
        totalScope3Emissions
      ) {
        // Ensure values are parsed as numbers regardless of their original type
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
          
          console.log("Setting calculated emissions from form values:", emissionsResults);
          setCalculatedEmissions(emissionsResults);
        }
      }
      
      // Get calculation logs from formValues if available
      if (emissionCalculationLogs && setCalculationLogs) {
        try {
          console.log("Parsing logs from form values");
          console.log("Type of emissionCalculationLogs:", typeof emissionCalculationLogs);
          
          // Handle different potential data types for logs using our improved safeJsonParse
          const parsedLogs = safeJsonParse<EmissionCalculationLogs>(emissionCalculationLogs, {
            scope1Calculations: [],
            scope2Calculations: [],
            scope3Calculations: []
          });
          
          // Ensure the structure is complete
          if (!parsedLogs.scope1Calculations) parsedLogs.scope1Calculations = [];
          if (!parsedLogs.scope2Calculations) parsedLogs.scope2Calculations = [];
          if (!parsedLogs.scope3Calculations) parsedLogs.scope3Calculations = [];
          
          console.log("Loaded calculation logs from form values");
          
          // Set calculation logs state if available
          setCalculationLogs(parsedLogs);
        } catch (error) {
          console.error("Error parsing emission calculation logs from form values:", error);
        }
      }
    } catch (error) {
      console.error("Error loading existing emissions from form values:", error);
    }
  };
};
