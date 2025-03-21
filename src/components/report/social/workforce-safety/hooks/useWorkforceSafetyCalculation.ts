
import { useCallback } from 'react';

export const useWorkforceSafetyCalculation = () => {
  // Calculate the work accidents rate based on the number of accidents and hours worked
  const calculateAccidentsRate = useCallback((accidents: number | null | undefined, hours: number | null | undefined): number | null => {
    if (
      accidents === null || 
      accidents === undefined || 
      hours === null || 
      hours === undefined || 
      hours === 0
    ) {
      return null;
    }
    
    // Formula: (Number of accidents / Total hours worked) x 1720 / 100
    // Per the standard calculation shown in the UI
    // For 2 accidents in 10,000 hours worked, this should result in 0.344
    return ((accidents / hours) * 1720) / 100;
  }, []);

  return {
    calculateAccidentsRate
  };
};
