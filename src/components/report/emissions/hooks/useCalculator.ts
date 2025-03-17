
import { useState, useEffect } from 'react';
import { useEmissionsCalculator } from '@/hooks/use-emissions-calculator';
import { useFormValueUpdater } from './useFormValueUpdater';
import { useEmissionsResults } from './useEmissionsResults';
import { useExistingEmissions } from './useExistingEmissions';
import { CalculatorState, EmissionsResults } from '../types';
import { useToast } from '@/hooks/use-toast';
import { EmissionFactorSource } from '@/lib/emissions-types';

export const useCalculator = (
  formValues: any,
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void),
  onResetClick?: () => void
) => {
  const [activeTab, setActiveTab] = useState<string>('scope1');
  const [calculatedEmissions, setCalculatedEmissions] = useState<EmissionsResults>({
    scope1: 0,
    scope2: 0,
    scope3: 0,
    total: 0
  });
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [calculationMethod, setCalculationMethod] = useState<EmissionFactorSource>(EmissionFactorSource.DEFRA);
  const { toast } = useToast();

  // Get the form value updater
  const { updateFormValues } = useFormValueUpdater(setFormValues);
  
  // Get emissions results handler
  const { handleCalculationResults } = useEmissionsResults(setFormValues);

  // Use our emissions calculator hook
  const { 
    inputs, 
    updateInput, 
    results, 
    details,
    calculateEmissions, 
    resetCalculation 
  } = useEmissionsCalculator(undefined, handleCalculationResults);

  // Update calculator when calculation method changes
  useEffect(() => {
    updateInput('calculationMethod', calculationMethod);
  }, [calculationMethod, updateInput]);

  // Update local state when calculator results change
  useEffect(() => {
    setCalculatedEmissions(results);
  }, [results]);

  // Monitor existing emissions data
  useExistingEmissions(
    formValues, 
    updateInput, 
    resetCalculation, 
    setCalculatedEmissions
  );

  // Function to perform the actual reset
  const performReset = () => {
    // First, reset the local state to show zeros in the UI
    setCalculatedEmissions({
      scope1: 0,
      scope2: 0,
      scope3: 0,
      total: 0
    });
    
    // Clear the form total values but keep input fields
    updateFormValues('totalScope1Emissions', '0');
    updateFormValues('totalScope2Emissions', '0');
    updateFormValues('totalScope3Emissions', '0');
    updateFormValues('totalScopeEmissions', '0');
    
    // Show toast confirmation
    toast({
      title: "Calcoli azzerati",
      description: "I dati delle emissioni sono stati azzerati correttamente.",
      duration: 3000,
    });
    
    // Finally, if there's an external reset handler, call it
    if (onResetClick) {
      onResetClick();
    }
  };

  // Handle reset button click delegated from EmissionsResults component
  const handleResetClick = () => {
    // Show dialog to confirm reset
    setShowResetDialog(true);
  };

  // Handler for dialog confirmation
  const handleResetConfirm = () => {
    performReset();
    setShowResetDialog(false);
  };

  // Handler for dialog cancellation
  const handleResetCancel = () => {
    setShowResetDialog(false);
  };

  return {
    activeTab,
    setActiveTab,
    calculatedEmissions,
    inputs,
    updateInput,
    calculateEmissions,
    handleResetClick,
    showResetDialog,
    setShowResetDialog,
    handleResetConfirm,
    handleResetCancel,
    calculationMethod,
    setCalculationMethod
  };
};
