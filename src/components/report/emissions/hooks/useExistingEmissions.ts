
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
    // Check if we received a reset command
    if (formValues.target && formValues.target.name === 'resetEmissions') {
      // Reset the calculator's state
      resetCalculation();
      
      // Also update the displayed emissions to zero
      if (setCalculatedEmissions) {
        setCalculatedEmissions({
          scope1: 0,
          scope2: 0,
          scope3: 0,
          total: 0
        });
      }
      return;
    }
    
    // Regular data loading logic
    const metricsData = getMetricsData(formValues);
    
    if (metricsData) {
      // Update the state with existing values
      const scope1 = parseFloat(metricsData.totalScope1Emissions) || 0;
      const scope2 = parseFloat(metricsData.totalScope2Emissions) || 0;
      const scope3 = parseFloat(metricsData.totalScope3Emissions) || 0;
      const total = parseFloat(metricsData.totalScopeEmissions) || 0;
      
      // Only update if there's at least one non-zero value or we're resetting
      if (scope1 > 0 || scope2 > 0 || scope3 > 0 || total > 0) {
        if (setCalculatedEmissions) {
          // Use the setCalculatedEmissions function to update emission results
          setCalculatedEmissions({
            scope1,
            scope2,
            scope3,
            total
          });
        }
      }
    }
  }, [formValues, updateInput, resetCalculation, setCalculatedEmissions]);
};
