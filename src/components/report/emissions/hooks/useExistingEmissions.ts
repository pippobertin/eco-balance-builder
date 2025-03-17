
import { useEffect } from 'react';
import { getMetricsData } from '../utils/formUtils';
import { EmissionsInput } from '@/hooks/emissions-calculator';
import { EmissionsResults } from '../types';

/**
 * Hook for monitoring and loading existing emissions data
 */
export const useExistingEmissions = (
  formValues: any,
  updateInput: (key: keyof EmissionsInput, value: any) => void,
  resetCalculation: () => void,
  setCalculatedEmissions?: (results: EmissionsResults) => void
) => {
  // Load existing calculation results
  useEffect(() => {
    const metricsData = getMetricsData(formValues);
    
    if (metricsData) {
      // Update the state with existing values
      const scope1 = parseFloat(metricsData.totalScope1Emissions) || 0;
      const scope2 = parseFloat(metricsData.totalScope2Emissions) || 0;
      const scope3 = parseFloat(metricsData.totalScope3Emissions) || 0;
      const total = parseFloat(metricsData.totalScopeEmissions) || 0;
      
      // Only update if there's at least one non-zero value
      if (scope1 > 0 || scope2 > 0 || scope3 > 0 && setCalculatedEmissions) {
        // Use the new setCalculatedEmissions function to update emission results
        setCalculatedEmissions({
          scope1,
          scope2,
          scope3,
          total
        });
      }
    }

    // Check for reset emission command
    if (formValues.target && formValues.target.name === 'resetEmissions') {
      resetCalculation();
    }
  }, [formValues, updateInput, resetCalculation, setCalculatedEmissions]);
};
