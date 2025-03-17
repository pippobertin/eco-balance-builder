
import { useState, useEffect } from 'react';
import { useEmissionsCalculator } from '@/hooks/use-emissions-calculator';
import { createSyntheticEvent, getMetricsData } from '../utils/formUtils';

export const useCalculator = (
  formValues: any,
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void),
  onResetClick?: () => void
) => {
  const [activeTab, setActiveTab] = useState<string>('scope1');

  // Emit value changes to parent component
  const updateFormValues = (name: string, value: any) => {
    if (typeof setFormValues === 'function') {
      if (setFormValues.length === 1) {
        // It's a location-specific metrics handler
        setFormValues(createSyntheticEvent(name, value));
      } else {
        // It's a global form handler (useState setter)
        (setFormValues as React.Dispatch<React.SetStateAction<any>>)((prev: any) => {
          return {
            ...prev,
            environmentalMetrics: {
              ...prev.environmentalMetrics,
              [name]: value
            }
          };
        });
      }
    }
  };

  // Use our custom hook for emissions calculations
  const { 
    inputs, 
    updateInput, 
    results: calculatedEmissions, 
    details,
    calculateEmissions, 
    resetCalculation 
  } = useEmissionsCalculator(undefined, (results, details) => {
    // This callback runs when calculation results change
    if (results.scope1 > 0) {
      updateFormValues('totalScope1Emissions', results.scope1.toFixed(2));
      updateFormValues('scope1CalculationDetails', details.scope1Details);
    }
    
    if (results.scope2 > 0) {
      updateFormValues('totalScope2Emissions', results.scope2.toFixed(2));
      updateFormValues('scope2CalculationDetails', details.scope2Details);
    }
    
    if (results.scope3 > 0) {
      updateFormValues('totalScope3Emissions', results.scope3.toFixed(2));
      updateFormValues('scope3CalculationDetails', details.scope3Details);
    }
    
    updateFormValues('totalScopeEmissions', results.total.toFixed(2));
  });

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
      if (scope1 > 0 || scope2 > 0 || scope3 > 0) {
        // Fixed: Using specific emission result values instead of "results" key
        const newResults = { scope1, scope2, scope3, total };
        // We need to set each property separately
        Object.entries(newResults).forEach(([key, value]) => {
          updateInput(key as keyof typeof inputs, value);
        });
      }
    }

    // Check for reset emission command
    if (formValues.target && formValues.target.name === 'resetEmissions') {
      resetCalculation();
    }
  }, [formValues]);

  // Handle reset button click delegated from EmissionsResults component
  const handleResetClick = () => {
    if (onResetClick) {
      onResetClick();
    }
  };

  return {
    activeTab,
    setActiveTab,
    calculatedEmissions,
    inputs,
    updateInput,
    calculateEmissions,
    handleResetClick
  };
};
