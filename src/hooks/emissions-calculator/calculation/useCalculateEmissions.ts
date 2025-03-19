
import { useCallback } from 'react';
import { 
  EmissionsInput, 
  EmissionsResults, 
  EmissionsDetails, 
  EmissionCalculationLogs,
  EmissionCalculationRecord
} from '../types';
import { useEmissionsRecords } from '../useEmissionsRecords';
import { useCalculationProcessor } from './useCalculationProcessor';
import { performEmissionsCalculation } from './performCalculation';

/**
 * Hook for calculating emissions
 */
export const useCalculateEmissions = (
  inputs: EmissionsInput,
  calculationLogs: EmissionCalculationLogs,
  setResults: (results: EmissionsResults) => void,
  setDetails: (details: EmissionsDetails) => void,
  setCalculationLogs: (logs: EmissionCalculationLogs) => void,
  onResultsChange?: (results: EmissionsResults, details: EmissionsDetails) => void,
  onCalculationLogChange?: (logs: EmissionCalculationLogs) => void
) => {
  // Get record management
  const { 
    createCalculationRecord,
    calculateTotalsFromLogs
  } = useEmissionsRecords();
  
  // Generate a unique ID for records
  const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };
  
  /**
   * Calculate emissions for a specific scope
   */
  const calculateEmissions = useCallback((scope?: 'scope1' | 'scope2' | 'scope3') => {
    console.log('Starting calculation for scope:', scope);
    console.log('Current inputs:', JSON.stringify(inputs));
    
    // Initialize results with zeros if not provided
    const initialResults: EmissionsResults = {
      scope1: 0,
      scope2: 0,
      scope3: 0,
      total: 0
    };
    
    // Perform the calculation using the performEmissionsCalculation function
    const { results: newResults, details: newDetails } = performEmissionsCalculation(inputs, scope);
    console.log('Calculation results:', newResults);
    console.log('Calculation details:', newDetails);
    
    // Ensure logs have the correct structure
    const safeScope1Calculations = Array.isArray(calculationLogs.scope1Calculations) ? 
      [...calculationLogs.scope1Calculations] : [];
    const safeScope2Calculations = Array.isArray(calculationLogs.scope2Calculations) ? 
      [...calculationLogs.scope2Calculations] : [];
    const safeScope3Calculations = Array.isArray(calculationLogs.scope3Calculations) ? 
      [...calculationLogs.scope3Calculations] : [];
    
    // Create updated logs
    let updatedLogs: EmissionCalculationLogs = { 
      scope1Calculations: safeScope1Calculations,
      scope2Calculations: safeScope2Calculations,
      scope3Calculations: safeScope3Calculations
    };
    
    // Update calculation logs if we have a new calculation
    if (scope) {
      // Create a record only if there are calculated emissions
      const emissionValue = scope === 'scope1' ? newResults.scope1 : 
                          scope === 'scope2' ? newResults.scope2 : newResults.scope3;
      
      console.log(`Checking emissions value for ${scope}:`, emissionValue);
      
      if (emissionValue > 0) {
        console.log(`Found positive emissions for ${scope}:`, emissionValue);
        
        try {
          // Parse details JSON if available
          const detailsStr = scope === 'scope1' ? newDetails.scope1Details : 
                           scope === 'scope2' ? newDetails.scope2Details : newDetails.scope3Details;
          
          console.log(`Details string for ${scope}:`, detailsStr);
          
          let detailsObj = {};
          if (detailsStr) {
            try {
              detailsObj = JSON.parse(detailsStr);
              console.log(`Parsed details object for ${scope}:`, detailsObj);
            } catch (e) {
              console.error(`Error parsing details for ${scope}:`, e);
            }
          }
          
          // Create a new record with the details
          const newRecord: EmissionCalculationRecord = {
            id: generateUniqueId(),
            date: new Date().toISOString(),
            scope: scope,
            source: detailsObj.source || '',
            description: scope === 'scope1' ? `${detailsObj.fuelType || 'Fuel'} emission` : 
                        scope === 'scope2' ? `${detailsObj.energyType || 'Energy'} emission` :
                        `${detailsObj.wasteType || detailsObj.purchaseType || detailsObj.transportType || detailsObj.activityType || 'Scope 3'} emission`,
            quantity: detailsObj.quantity || 0,
            unit: detailsObj.unit || '',
            emissions: emissionValue,
            details: detailsObj
          };
          
          console.log('Created new calculation record:', newRecord);
          
          // Add the new record to the appropriate scope array
          if (scope === 'scope1') {
            updatedLogs.scope1Calculations = [...updatedLogs.scope1Calculations, newRecord];
          } else if (scope === 'scope2') {
            updatedLogs.scope2Calculations = [...updatedLogs.scope2Calculations, newRecord];
          } else if (scope === 'scope3') {
            updatedLogs.scope3Calculations = [...updatedLogs.scope3Calculations, newRecord];
          }
          
          // Update calculation logs
          setCalculationLogs(updatedLogs);
          console.log('Updated calculation logs:', updatedLogs);
          
          // Callback for log changes
          if (onCalculationLogChange) {
            onCalculationLogChange(updatedLogs);
          }
        } catch (error) {
          console.error('Error creating calculation record:', error);
        }
      } else {
        console.warn(`No emissions calculated for ${scope}, value:`, emissionValue);
      }
    }
    
    // Update results
    setResults(newResults);
    
    // Update details
    setDetails(newDetails);
    
    // Callback for results changes
    if (onResultsChange) {
      onResultsChange(newResults, newDetails);
    }
    
    return { results: newResults, details: newDetails };
  }, [
    inputs, 
    calculationLogs, 
    setCalculationLogs, 
    onCalculationLogChange,
    setResults,
    setDetails,
    onResultsChange
  ]);
  
  return {
    calculateEmissions
  };
};
