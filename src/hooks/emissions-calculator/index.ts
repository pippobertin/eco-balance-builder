
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EmissionsInput, EmissionsResults, EmissionsDetails, EmissionCalculationRecord, EmissionCalculationLogs } from './types';
import { performEmissionsCalculation } from './calculations';
import { createDefaultInputs, resetQuantityInputs } from './input-handlers';

// Use 'export type' for type exports when isolatedModules is enabled
export { useEmissionsCalculator };
export type { EmissionsInput, EmissionsResults, EmissionsDetails, EmissionCalculationRecord, EmissionCalculationLogs };

const useEmissionsCalculator = (
  initialInputs?: EmissionsInput,
  onResultsChange?: (results: EmissionsResults, details: EmissionsDetails) => void,
  onCalculationLogChange?: (logs: EmissionCalculationLogs) => void
) => {
  // State for inputs with default values
  const [inputs, setInputs] = useState<EmissionsInput>(initialInputs || createDefaultInputs());
  
  // State for calculation results
  const [results, setResults] = useState<EmissionsResults>({
    scope1: 0,
    scope2: 0,
    scope3: 0,
    total: 0
  });
  
  // State for calculation details
  const [details, setDetails] = useState<EmissionsDetails>({
    scope1Details: '',
    scope2Details: '',
    scope3Details: ''
  });
  
  // State for calculation logs
  const [calculationLogs, setCalculationLogs] = useState<EmissionCalculationLogs>({
    scope1Calculations: [],
    scope2Calculations: [],
    scope3Calculations: []
  });
  
  // Input change handlers
  const updateInput = <K extends keyof EmissionsInput>(key: K, value: EmissionsInput[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };
  
  // Function to create a calculation record
  const createCalculationRecord = (scope: 'scope1' | 'scope2' | 'scope3', inputs: EmissionsInput, emissionsTonnes: number, details: any): EmissionCalculationRecord => {
    let source = '';
    let description = '';
    let quantity = 0;
    let unit = '';
    
    if (scope === 'scope1') {
      source = inputs.scope1Source || 'fuel';
      if (source === 'fuel') {
        description = `Combustibile: ${inputs.fuelType}`;
      } else if (source === 'fleet') {
        description = `Flotta aziendale: ${inputs.fuelType}`;
      } else {
        description = `Altre emissioni dirette: ${inputs.fuelType}`;
      }
      quantity = parseFloat(inputs.fuelQuantity || '0');
      unit = inputs.fuelUnit || 'L';
    } else if (scope === 'scope2') {
      source = 'energy';
      description = `Energia: ${inputs.energyType} (${inputs.renewablePercentage || 0}% rinnovabile)`;
      quantity = parseFloat(inputs.energyQuantity || '0');
      unit = 'kWh';
    } else if (scope === 'scope3') {
      source = inputs.scope3Category || 'transport';
      if (source === 'transport') {
        description = `Trasporto: ${inputs.transportType}`;
        quantity = parseFloat(inputs.transportDistance || '0');
        unit = 'km';
      } else if (source === 'waste') {
        description = `Rifiuti: ${inputs.wasteType}`;
        quantity = parseFloat(inputs.wasteQuantity || '0');
        unit = 'kg';
      } else if (source === 'purchases') {
        description = `Acquisti: ${inputs.purchaseType}`;
        quantity = parseFloat(inputs.purchaseQuantity || '0');
        unit = inputs.purchaseType === 'PURCHASED_GOODS' ? 'kg' : 'unità';
      }
    }
    
    return {
      id: uuidv4(),
      date: new Date().toISOString(),
      source,
      scope,
      description,
      quantity,
      unit,
      emissions: emissionsTonnes,
      details
    };
  };

  // Calculate totals from calculation logs
  const calculateTotalsFromLogs = (logs: EmissionCalculationLogs): EmissionsResults => {
    const scope1Total = logs.scope1Calculations.reduce(
      (sum, calc) => sum + calc.emissions, 0
    );
    
    const scope2Total = logs.scope2Calculations.reduce(
      (sum, calc) => sum + calc.emissions, 0
    );
    
    const scope3Total = logs.scope3Calculations.reduce(
      (sum, calc) => sum + calc.emissions, 0
    );
    
    return {
      scope1: scope1Total,
      scope2: scope2Total,
      scope3: scope3Total,
      total: scope1Total + scope2Total + scope3Total
    };
  };
  
  // Calculation function
  const calculateEmissions = (scope?: 'scope1' | 'scope2' | 'scope3') => {
    const { results: newResults, details: newDetails } = performEmissionsCalculation(inputs, scope);
    
    // Create updated logs
    let updatedLogs = { ...calculationLogs };
    
    // Update calculation logs if we have a new calculation
    if (scope) {
      // Create a record only if there are calculated emissions
      const emissionValue = scope === 'scope1' ? newResults.scope1 : 
                           scope === 'scope2' ? newResults.scope2 : newResults.scope3;
      
      if (emissionValue > 0) {
        const detailsObj = scope === 'scope1' ? JSON.parse(newDetails.scope1Details || '{}') : 
                           scope === 'scope2' ? JSON.parse(newDetails.scope2Details || '{}') : 
                           JSON.parse(newDetails.scope3Details || '{}');
        
        const newRecord = createCalculationRecord(
          scope, 
          inputs,
          emissionValue,
          detailsObj
        );
        
        updatedLogs = { ...calculationLogs };
        if (scope === 'scope1') {
          updatedLogs.scope1Calculations = [...calculationLogs.scope1Calculations, newRecord];
        } else if (scope === 'scope2') {
          updatedLogs.scope2Calculations = [...calculationLogs.scope2Calculations, newRecord];
        } else if (scope === 'scope3') {
          updatedLogs.scope3Calculations = [...calculationLogs.scope3Calculations, newRecord];
        }
        
        // Update calculation logs
        setCalculationLogs(updatedLogs);
        
        // Callback for log changes
        if (onCalculationLogChange) {
          onCalculationLogChange(updatedLogs);
        }
      }
    }
    
    // Calculate new totals from logs
    const updatedResults = calculateTotalsFromLogs(updatedLogs);
    
    // Update results state
    setResults(updatedResults);
    
    // Update details state
    setDetails(prev => ({
      scope1Details: scope === 'scope1' ? newDetails.scope1Details : prev.scope1Details,
      scope2Details: scope === 'scope2' ? newDetails.scope2Details : prev.scope2Details,
      scope3Details: scope === 'scope3' ? newDetails.scope3Details : prev.scope3Details
    }));
    
    // Call callback if provided
    if (onResultsChange) {
      onResultsChange(updatedResults, newDetails);
    }
    
    return { results: updatedResults, details: newDetails };
  };
  
  // Reset calculation
  const resetCalculation = () => {
    // Reset calculation logs
    const newLogs = {
      scope1Calculations: [],
      scope2Calculations: [],
      scope3Calculations: []
    };
    
    // Reset results based on empty logs
    const newResults = {
      scope1: 0,
      scope2: 0,
      scope3: 0,
      total: 0
    };
    
    // Reset details
    const newDetails = {
      scope1Details: '',
      scope2Details: '',
      scope3Details: ''
    };
    
    // Update state
    setResults(newResults);
    setDetails(newDetails);
    setCalculationLogs(newLogs);
    
    // Reset input fields that contain quantities
    setInputs(resetQuantityInputs(inputs));
    
    // Call callbacks if provided
    if (onResultsChange) {
      onResultsChange(newResults, newDetails);
    }
    
    if (onCalculationLogChange) {
      onCalculationLogChange(newLogs);
    }
    
    return { results: newResults, details: newDetails };
  };
  
  // Function to remove a specific calculation
  const removeCalculation = (calculationId: string) => {
    console.log("Removing calculation in emissions hook:", calculationId);
    
    setCalculationLogs(prev => {
      // Find which scope contains this calculation
      let targetScope: 'scope1Calculations' | 'scope2Calculations' | 'scope3Calculations' | null = null;
      
      // Check each scope for the calculation ID
      for (const scope of ['scope1Calculations', 'scope2Calculations', 'scope3Calculations'] as const) {
        if (prev[scope].some(calc => calc.id === calculationId)) {
          targetScope = scope;
          break;
        }
      }
      
      if (!targetScope) {
        console.error("Target scope not found for ID:", calculationId);
        console.log("Available calculations:", JSON.stringify(prev));
        return prev;
      }
      
      console.log(`Found calculation to remove in ${targetScope}`);
      
      // Create new logs object with the calculation removed
      const updatedLogs = { ...prev };
      updatedLogs[targetScope] = prev[targetScope].filter(
        calc => calc.id !== calculationId
      );
      
      console.log(`Removed calculation from ${targetScope}. New count:`, 
                 updatedLogs[targetScope].length);
      
      // Calculate new totals from updated logs
      const updatedResults = calculateTotalsFromLogs(updatedLogs);
      
      // Update results state
      setResults(updatedResults);
      
      // Call callbacks
      if (onCalculationLogChange) {
        onCalculationLogChange(updatedLogs);
      }
      
      if (onResultsChange) {
        onResultsChange(updatedResults, details);
      }
      
      return updatedLogs;
    });
  };
  
  return {
    inputs,
    updateInput,
    results,
    details,
    calculationLogs,
    calculateEmissions,
    resetCalculation,
    removeCalculation
  };
};
