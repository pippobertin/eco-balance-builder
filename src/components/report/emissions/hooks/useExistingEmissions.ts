
import { useState, useEffect } from 'react';
import { useReport } from '@/hooks/use-report-context';
import { useEmissionsLoad } from './emissions-results/useEmissionsLoad';
import { EmissionCalculationLogs } from '@/hooks/emissions-calculator/types';

export const useExistingEmissions = () => {
  const { currentReport } = useReport();
  const [existingEmissions, setExistingEmissions] = useState<any>(null);
  const [existingLogs, setExistingLogs] = useState<EmissionCalculationLogs>({
    scope1Calculations: [],
    scope2Calculations: [],
    scope3Calculations: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { loadEmissionsData } = useEmissionsLoad(currentReport?.id);
  
  useEffect(() => {
    if (currentReport?.id) {
      setIsLoading(true);
      setError(null);
      
      loadEmissionsData(currentReport.id)
        .then(data => {
          if (data) {
            setExistingEmissions(data);
            
            // Safely handle the calculation logs
            if (data.calculation_logs) {
              // Ensure we have a proper EmissionCalculationLogs object
              const logs = data.calculation_logs as unknown as EmissionCalculationLogs;
              
              setExistingLogs({
                scope1Calculations: Array.isArray(logs.scope1Calculations) ? logs.scope1Calculations : [],
                scope2Calculations: Array.isArray(logs.scope2Calculations) ? logs.scope2Calculations : [],
                scope3Calculations: Array.isArray(logs.scope3Calculations) ? logs.scope3Calculations : []
              });
            }
          }
        })
        .catch(err => {
          console.error('Error loading existing emissions:', err);
          setError('Failed to load existing emissions data');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [currentReport?.id]);
  
  return {
    existingEmissions,
    existingLogs,
    isLoading,
    error
  };
};
