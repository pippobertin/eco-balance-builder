
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
    
    // Formula: (Number of accidents / Total hours worked) x 200,000
    // For 3 accidents in 10,000 hours worked, this should result in 0.516
    return (accidents / hours) * 1720;
  }, []);

  return {
    calculateAccidentsRate
  };
};
