
import { useEffect } from 'react';
import { EmissionsInput, EmissionsResults } from '@/hooks/emissions-calculator';

export const useExistingEmissions = (
  formValues: any,
  updateInput: (key: keyof EmissionsInput, value: any) => void,
  resetCalculation: () => void,
  setCalculatedEmissions?: (results: EmissionsResults) => void
) => {
  // Effect to load existing emissions data from formValues
  useEffect(() => {
    if (!formValues || !formValues.environmentalMetrics) {
      return;
    }
    
    // Extract emission values from the form
    const { 
      totalScope1Emissions, 
      totalScope2Emissions, 
      totalScope3Emissions, 
      totalScopeEmissions 
    } = formValues.environmentalMetrics;
    
    // Only update if we have values and they are not already loaded
    if (
      totalScope1Emissions || 
      totalScope2Emissions || 
      totalScope3Emissions
    ) {
      // Parse the values to numbers
      const scope1 = parseFloat(totalScope1Emissions || '0');
      const scope2 = parseFloat(totalScope2Emissions || '0');
      const scope3 = parseFloat(totalScope3Emissions || '0');
      const total = parseFloat(totalScopeEmissions || '0');
      
      // Update the calculated emissions state if available
      if (setCalculatedEmissions) {
        setCalculatedEmissions({
          scope1,
          scope2,
          scope3,
          total: isNaN(total) ? (scope1 + scope2 + scope3) : total
        });
      }
    }
    
    // Get calculation logs from formValues if available
    if (formValues.environmentalMetrics.emissionCalculationLogs) {
      try {
        const logsData = JSON.parse(formValues.environmentalMetrics.emissionCalculationLogs);
        // Se ci sono logs qui, non dobbiamo fare nulla di particolare perché
        // saranno gestiti direttamente nel componente EmissionsCalculationTable
      } catch (error) {
        console.error("Error parsing emission calculation logs:", error);
      }
    }
  }, [formValues?.environmentalMetrics]);
};
