
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
  
  // Calculation function
  const calculateEmissions = (scope?: 'scope1' | 'scope2' | 'scope3') => {
    const { results: newResults, details: newDetails } = performEmissionsCalculation(inputs, scope);
    
    // Update state
    setResults(prev => ({
      scope1: scope === 'scope1' ? newResults.scope1 : prev.scope1,
      scope2: scope === 'scope2' ? newResults.scope2 : prev.scope2,
      scope3: scope === 'scope3' ? newResults.scope3 : prev.scope3,
      total: (scope === 'scope1' ? newResults.scope1 : prev.scope1) + 
             (scope === 'scope2' ? newResults.scope2 : prev.scope2) + 
             (scope === 'scope3' ? newResults.scope3 : prev.scope3)
    }));
    
    setDetails(prev => ({
      scope1Details: scope === 'scope1' ? newDetails.scope1Details : prev.scope1Details,
      scope2Details: scope === 'scope2' ? newDetails.scope2Details : prev.scope2Details,
      scope3Details: scope === 'scope3' ? newDetails.scope3Details : prev.scope3Details
    }));
    
    // Update calculation logs
    if (scope) {
      // Crea un record solo se ci sono emissioni calcolate
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
        
        setCalculationLogs(prev => {
          const updatedLogs = { ...prev };
          if (scope === 'scope1') {
            updatedLogs.scope1Calculations = [...prev.scope1Calculations, newRecord];
          } else if (scope === 'scope2') {
            updatedLogs.scope2Calculations = [...prev.scope2Calculations, newRecord];
          } else if (scope === 'scope3') {
            updatedLogs.scope3Calculations = [...prev.scope3Calculations, newRecord];
          }
          
          // Callback for log changes
          if (onCalculationLogChange) {
            onCalculationLogChange(updatedLogs);
          }
          
          return updatedLogs;
        });
      }
    }
    
    // Call callback if provided
    if (onResultsChange) {
      onResultsChange(newResults, newDetails);
    }
    
    return { results: newResults, details: newDetails };
  };
  
  // Reset calculation
  const resetCalculation = () => {
    // Reset results
    const newResults = {
      scope1: 0,
      scope2: 0,
      scope3: 0,
      total: 0
    };
    
    const newDetails = {
      scope1Details: '',
      scope2Details: '',
      scope3Details: ''
    };
    
    // Reset logs
    const newLogs = {
      scope1Calculations: [],
      scope2Calculations: [],
      scope3Calculations: []
    };
    
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
    setCalculationLogs(prev => {
      // Find which scope contains this calculation
      let targetScope: 'scope1' | 'scope2' | 'scope3' | null = null;
      let calculationToRemove: EmissionCalculationRecord | null = null;
      
      for (const scope of ['scope1', 'scope2', 'scope3'] as Array<'scope1' | 'scope2' | 'scope3'>) {
        const calculation = prev[`${scope}Calculations`].find(calc => calc.id === calculationId);
        if (calculation) {
          targetScope = scope;
          calculationToRemove = calculation;
          break;
        }
      }
      
      if (!targetScope || !calculationToRemove) return prev;
      
      // Create new logs object with the calculation removed
      const updatedLogs = { ...prev };
      updatedLogs[`${targetScope}Calculations`] = prev[`${targetScope}Calculations`].filter(
        calc => calc.id !== calculationId
      );
      
      // Recalculate the total emissions for this scope
      const scopeEmissions = updatedLogs[`${targetScope}Calculations`].reduce(
        (sum, calc) => sum + calc.emissions, 
        0
      );
      
      // Update results
      setResults(prevResults => ({
        ...prevResults,
        [targetScope]: scopeEmissions,
        total: prevResults.total - calculationToRemove.emissions
      }));
      
      // Call callbacks
      if (onCalculationLogChange) {
        onCalculationLogChange(updatedLogs);
      }
      
      if (onResultsChange) {
        onResultsChange({
          ...results,
          [targetScope]: scopeEmissions,
          total: results.total - calculationToRemove.emissions
        }, details);
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
