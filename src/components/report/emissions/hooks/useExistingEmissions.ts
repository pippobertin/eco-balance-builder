
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EmissionCalculationLogs, EmissionCalculationRecord } from '@/hooks/emissions-calculator/types';
import { safeJsonParse } from '@/integrations/supabase/utils/jsonUtils';

export const useExistingEmissions = (reportId: string | undefined) => {
  const [existingEmissions, setExistingEmissions] = useState<{
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
  }>({
    scope1: 0,
    scope2: 0,
    scope3: 0,
    total: 0
  });
  
  const [existingCalculations, setExistingCalculations] = useState<EmissionCalculationLogs>({
    scope1Calculations: [],
    scope2Calculations: [],
    scope3Calculations: []
  });
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (reportId) {
      loadExistingData(reportId);
    }
  }, [reportId]);

  const loadExistingData = async (reportId: string) => {
    setIsLoading(true);
    try {
      // Load emissions data
      const { data: emissionsData, error: emissionsError } = await supabase
        .from('emissions_data')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();

      if (emissionsError) {
        console.error('Error loading emissions data:', emissionsError);
      }

      // Load calculation logs
      const { data: logsData, error: logsError } = await supabase
        .from('emissions_logs')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();

      if (logsError) {
        console.error('Error loading calculation logs:', logsError);
      }

      // Update state with emissions data
      if (emissionsData) {
        const scope1 = parseFloat(emissionsData.scope1_emissions as string) || 0;
        const scope2 = parseFloat(emissionsData.scope2_emissions as string) || 0;
        const scope3 = parseFloat(emissionsData.scope3_emissions as string) || 0;
        const total = parseFloat(emissionsData.total_emissions as string) || 0;
        
        setExistingEmissions({
          scope1,
          scope2,
          scope3,
          total
        });
      }

      // Update state with calculation logs
      if (logsData && logsData.calculation_logs) {
        // Parse the JSON data
        const calculationLogsString = typeof logsData.calculation_logs === 'string' 
          ? logsData.calculation_logs 
          : JSON.stringify(logsData.calculation_logs);
          
        const calculations = safeJsonParse<EmissionCalculationLogs>(
          calculationLogsString,
          {
            scope1Calculations: [],
            scope2Calculations: [],
            scope3Calculations: []
          }
        );
        
        setExistingCalculations(calculations);
      }
    } catch (error) {
      console.error('Error loading existing emissions data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    existingEmissions,
    existingCalculations,
    isLoading
  };
};
