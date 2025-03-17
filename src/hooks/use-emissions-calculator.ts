
import { useState, useEffect } from 'react';
import { 
  EmissionFactorSource, 
  PeriodType, 
  FuelType, 
  EnergyType, 
  TransportType, 
  WasteType, 
  PurchaseType 
} from '@/lib/emissions-types';
import { 
  calculateScope1Emissions, 
  calculateScope2Emissions, 
  calculateScope3Emissions, 
  getEmissionFactorSource 
} from '@/lib/emissions-calculator';

interface EmissionsResults {
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
}

interface EmissionsInput {
  // Scope 1 inputs
  scope1Source?: string;
  fuelType?: FuelType;
  fuelQuantity?: string;
  fuelUnit?: string;
  
  // Scope 2 inputs
  energyType?: EnergyType;
  energyQuantity?: string;
  renewablePercentage?: number;
  
  // Scope 3 inputs
  scope3Category?: string;
  transportType?: TransportType;
  transportDistance?: string;
  wasteType?: WasteType;
  wasteQuantity?: string;
  purchaseType?: PurchaseType;
  purchaseQuantity?: string;
  
  // Common inputs
  periodType?: PeriodType;
  calculationMethod?: EmissionFactorSource;
}

interface EmissionsDetails {
  scope1Details: string;
  scope2Details: string;
  scope3Details: string;
}

export const useEmissionsCalculator = (
  initialInputs?: EmissionsInput,
  onResultsChange?: (results: EmissionsResults, details: EmissionsDetails) => void
) => {
  // State for inputs with default values
  const [inputs, setInputs] = useState<EmissionsInput>(initialInputs || {
    scope1Source: 'fuel',
    fuelType: 'DIESEL',
    fuelQuantity: '',
    fuelUnit: 'L',
    energyType: 'ELECTRICITY_IT',
    energyQuantity: '',
    renewablePercentage: 0,
    scope3Category: 'transport',
    transportType: 'BUSINESS_TRAVEL_CAR',
    transportDistance: '',
    wasteType: 'WASTE_LANDFILL',
    wasteQuantity: '',
    purchaseType: 'PURCHASED_GOODS',
    purchaseQuantity: '',
    periodType: PeriodType.ANNUAL,
    calculationMethod: EmissionFactorSource.DEFRA
  });
  
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
  
  // Input change handlers
  const updateInput = <K extends keyof EmissionsInput>(key: K, value: EmissionsInput[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };
  
  // Calculation function
  const calculateEmissions = (scope?: 'scope1' | 'scope2' | 'scope3') => {
    const newResults = { ...results };
    const newDetails = { ...details };
    
    // Calculate Scope 1 emissions if requested or not specified
    if (!scope || scope === 'scope1') {
      if (inputs.fuelType && inputs.fuelQuantity && inputs.fuelQuantity !== '') {
        const quantity = parseFloat(inputs.fuelQuantity);
        if (!isNaN(quantity) && quantity > 0) {
          const emissionsKg = calculateScope1Emissions(
            inputs.fuelType, 
            quantity, 
            inputs.fuelUnit || 'L'
          );
          const emissionsTonnes = emissionsKg / 1000;
          newResults.scope1 = emissionsTonnes;
          
          // Save calculation details
          const calculationDetails = {
            fuelType: inputs.fuelType,
            quantity,
            unit: inputs.fuelUnit,
            periodType: inputs.periodType,
            emissionsKg,
            emissionsTonnes,
            calculationDate: new Date().toISOString(),
            source: getEmissionFactorSource(inputs.fuelType)
          };
          
          newDetails.scope1Details = JSON.stringify(calculationDetails);
        }
      }
    }
    
    // Calculate Scope 2 emissions if requested or not specified
    if (!scope || scope === 'scope2') {
      if (inputs.energyType && inputs.energyQuantity && inputs.energyQuantity !== '') {
        const quantity = parseFloat(inputs.energyQuantity);
        if (!isNaN(quantity) && quantity > 0) {
          const emissionsKg = calculateScope2Emissions(
            inputs.energyType, 
            quantity, 
            'kWh', 
            inputs.renewablePercentage !== undefined ? inputs.renewablePercentage / 100 : undefined
          );
          const emissionsTonnes = emissionsKg / 1000;
          newResults.scope2 = emissionsTonnes;
          
          // Save calculation details
          const calculationDetails = {
            energyType: inputs.energyType,
            quantity,
            unit: 'kWh',
            renewablePercentage: inputs.renewablePercentage,
            periodType: inputs.periodType,
            emissionsKg,
            emissionsTonnes,
            calculationDate: new Date().toISOString(),
            source: getEmissionFactorSource(inputs.energyType)
          };
          
          newDetails.scope2Details = JSON.stringify(calculationDetails);
        }
      }
    }
    
    // Calculate Scope 3 emissions if requested or not specified
    if (!scope || scope === 'scope3') {
      if (inputs.scope3Category === 'transport' && inputs.transportType && inputs.transportDistance && inputs.transportDistance !== '') {
        const distance = parseFloat(inputs.transportDistance);
        if (!isNaN(distance) && distance > 0) {
          const emissionsKg = calculateScope3Emissions(
            inputs.transportType,
            distance,
            'km'
          );
          const emissionsTonnes = emissionsKg / 1000;
          newResults.scope3 = emissionsTonnes;
          
          // Save calculation details
          const calculationDetails = {
            activityType: inputs.transportType,
            quantity: distance,
            unit: 'km',
            secondaryQuantity: 0,
            secondaryUnit: 't',
            periodType: inputs.periodType,
            emissionsKg,
            emissionsTonnes,
            calculationDate: new Date().toISOString(),
            source: getEmissionFactorSource(inputs.transportType)
          };
          
          newDetails.scope3Details = JSON.stringify(calculationDetails);
        }
      } else if (inputs.scope3Category === 'waste' && inputs.wasteType && inputs.wasteQuantity && inputs.wasteQuantity !== '') {
        const quantity = parseFloat(inputs.wasteQuantity);
        if (!isNaN(quantity) && quantity > 0) {
          const emissionsKg = calculateScope3Emissions(
            inputs.wasteType,
            quantity,
            'kg'
          );
          const emissionsTonnes = emissionsKg / 1000;
          newResults.scope3 = emissionsTonnes;
          
          // Save calculation details
          const calculationDetails = {
            activityType: inputs.wasteType,
            quantity,
            unit: 'kg',
            periodType: inputs.periodType,
            emissionsKg,
            emissionsTonnes,
            calculationDate: new Date().toISOString(),
            source: getEmissionFactorSource(inputs.wasteType)
          };
          
          newDetails.scope3Details = JSON.stringify(calculationDetails);
        }
      } else if (inputs.scope3Category === 'purchases' && inputs.purchaseType && inputs.purchaseQuantity && inputs.purchaseQuantity !== '') {
        const quantity = parseFloat(inputs.purchaseQuantity);
        if (!isNaN(quantity) && quantity > 0) {
          const emissionsKg = calculateScope3Emissions(
            inputs.purchaseType,
            quantity,
            inputs.purchaseType === 'PURCHASED_GOODS' ? 'kg' : 'unit'
          );
          const emissionsTonnes = emissionsKg / 1000;
          newResults.scope3 = emissionsTonnes;
          
          // Save calculation details
          const calculationDetails = {
            activityType: inputs.purchaseType,
            quantity,
            unit: inputs.purchaseType === 'PURCHASED_GOODS' ? 'kg' : 'unit',
            periodType: inputs.periodType,
            emissionsKg,
            emissionsTonnes,
            calculationDate: new Date().toISOString(),
            source: getEmissionFactorSource(inputs.purchaseType)
          };
          
          newDetails.scope3Details = JSON.stringify(calculationDetails);
        }
      }
    }
    
    // Calculate total emissions
    newResults.total = newResults.scope1 + newResults.scope2 + newResults.scope3;
    
    // Update state
    setResults(newResults);
    setDetails(newDetails);
    
    // Call callback if provided
    if (onResultsChange) {
      onResultsChange(newResults, newDetails);
    }
    
    return { results: newResults, details: newDetails };
  };
  
  // Reset calculation
  const resetCalculation = () => {
    setResults({
      scope1: 0,
      scope2: 0,
      scope3: 0,
      total: 0
    });
    
    setDetails({
      scope1Details: '',
      scope2Details: '',
      scope3Details: ''
    });
    
    // Reset input fields that contain quantities
    setInputs(prev => ({
      ...prev,
      fuelQuantity: '',
      energyQuantity: '',
      transportDistance: '',
      wasteQuantity: '',
      purchaseQuantity: ''
    }));
    
    // Call callback if provided
    if (onResultsChange) {
      onResultsChange(
        { scope1: 0, scope2: 0, scope3: 0, total: 0 },
        { scope1Details: '', scope2Details: '', scope3Details: '' }
      );
    }
  };
  
  // Effect to recalculate when inputs change significantly
  useEffect(() => {
    // This effect is intentionally left empty. We don't want to automatically
    // recalculate on each input change, only when calculateEmissions is called explicitly.
  }, [inputs]);
  
  return {
    inputs,
    updateInput,
    results,
    details,
    calculateEmissions,
    resetCalculation
  };
};
