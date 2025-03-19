
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EmissionsRecord } from '@/hooks/emissions-calculator/types';
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
  
  const [existingCalculations, setExistingCalculations] = useState<EmissionsRecord>({
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
        setExistingEmissions({
          scope1: parseFloat(emissionsData.scope1_emissions) || 0,
          scope2: parseFloat(emissionsData.scope2_emissions) || 0,
          scope3: parseFloat(emissionsData.scope3_emissions) || 0,
          total: parseFloat(emissionsData.total_emissions) || 0
        });
      }

      // Update state with calculation logs
      if (logsData && logsData.calculation_logs) {
        // Parse the JSON data
        const calculations = safeJsonParse(logsData.calculation_logs, {
          scope1Calculations: [],
          scope2Calculations: [],
          scope3Calculations: []
        });
        
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
