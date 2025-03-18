
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EmissionsInput, EmissionCalculationRecord, EmissionCalculationLogs } from './types';

/**
 * Hook for managing emissions calculation records
 */
export const useEmissionsRecords = () => {
  /**
   * Create a calculation record for a specific scope
   */
  const createCalculationRecord = useCallback((
    scope: 'scope1' | 'scope2' | 'scope3', 
    inputs: EmissionsInput, 
    emissionsTonnes: number, 
    details: any
  ): EmissionCalculationRecord => {
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
  }, []);

  /**
   * Calculate totals from calculation logs
   */
  const calculateTotalsFromLogs = useCallback((logs: EmissionCalculationLogs) => {
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
  }, []);

  /**
   * Remove a calculation record from logs
   */
  const removeRecord = useCallback((
    logs: EmissionCalculationLogs,
    targetScope: 'scope1Calculations' | 'scope2Calculations' | 'scope3Calculations',
    calculationId: string
  ): EmissionCalculationLogs => {
    const updatedLogs = { ...logs };
    updatedLogs[targetScope] = logs[targetScope].filter(
      calc => calc.id !== calculationId
    );
    
    console.log(`Removed calculation from ${targetScope}. New count:`, 
               updatedLogs[targetScope].length);
               
    return updatedLogs;
  }, []);
  
  return {
    createCalculationRecord,
    calculateTotalsFromLogs,
    removeRecord
  };
};
