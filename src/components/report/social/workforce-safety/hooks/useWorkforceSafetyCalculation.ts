
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
    
    // Formula: (Number of accidents / Total hours worked) x 1720
    // Using only 2 decimal places as specified
    const result = (accidents / hours) * 1720;
    
    // Return with fixed 2 decimal precision
    return parseFloat(result.toFixed(2));
  }, []);

  return {
    calculateAccidentsRate
  };
};
