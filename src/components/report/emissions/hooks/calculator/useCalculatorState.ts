
import { useState, useEffect } from 'react';
import { CalculatorState } from './types';
import { EmissionCalculationLogs } from '@/hooks/emissions-calculator/types';
import { useExistingEmissions } from '../useExistingEmissions';

export const useCalculatorState = (reportId: string | undefined): CalculatorState => {
  const [activeTab, setActiveTab] = useState<string>('scope1');
  const [calculatedEmissions, setCalculatedEmissions] = useState({
    scope1: 0,
    scope2: 0,
    scope3: 0,
    total: 0
  });
  
  // Initial logs state
  const [calculationLogs, setCalculationLogs] = useState<EmissionCalculationLogs>({
    scope1Calculations: [],
    scope2Calculations: [],
    scope3Calculations: []
  });
  
  // Load existing emissions data
  const { existingEmissions, existingLogs, isLoading } = useExistingEmissions();
  
  // Debug log to track the state of calculation logs
  useEffect(() => {
    console.log('Current calculation logs state:', calculationLogs);
    console.log('Scope1 calculations count:', calculationLogs.scope1Calculations?.length || 0);
    console.log('Scope2 calculations count:', calculationLogs.scope2Calculations?.length || 0);
    console.log('Scope3 calculations count:', calculationLogs.scope3Calculations?.length || 0);
  }, [calculationLogs]);
  
  // Load existing emissions when available
  useEffect(() => {
    if (existingEmissions) {
      console.log('Loading existing emissions:', existingEmissions);
      setCalculatedEmissions(existingEmissions);
    }
    
    if (existingLogs) {
      console.log('Loading existing calculations:', existingLogs);
      
      // Ensure we have valid arrays for each scope
      const validatedCalculations: EmissionCalculationLogs = {
        scope1Calculations: Array.isArray(existingLogs.scope1Calculations) 
          ? existingLogs.scope1Calculations : [],
        scope2Calculations: Array.isArray(existingLogs.scope2Calculations)
          ? existingLogs.scope2Calculations : [],
        scope3Calculations: Array.isArray(existingLogs.scope3Calculations)
          ? existingLogs.scope3Calculations : []
      };
      
      console.log('Validated calculation logs:', validatedCalculations);
      setCalculationLogs(validatedCalculations);
    }
  }, [existingEmissions, existingLogs]);

  return {
    activeTab,
    setActiveTab,
    calculatedEmissions,
    setCalculatedEmissions,
    calculationLogs,
    setCalculationLogs,
    isLoading,
    isLoadingExisting: isLoading, // Add isLoadingExisting for GHGEmissionsCalculator
    isSaving: false, // Will be updated in the main hook
    lastSaved: null, // Will be updated in the main hook
  };
};
