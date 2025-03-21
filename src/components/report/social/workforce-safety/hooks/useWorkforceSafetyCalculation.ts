
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
    
    // Formula: (Number of accidents / Total hours worked) x 172000 / 1000
    // Divide by 1000 to get the correct decimal positions (e.g., 5.16 instead of 51.6)
    const result = ((accidents / hours) * 172000) / 1000;
    
    // Return with fixed decimal precision to ensure proper formatting
    return parseFloat(result.toFixed(3));
  }, []);

  return {
    calculateAccidentsRate
  };
};
