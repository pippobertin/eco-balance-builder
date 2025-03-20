
import { EmissionsInput, EmissionsResults, EmissionsDetails } from './types';
import { performEmissionsCalculation } from './calculation/performCalculation';

/**
 * Hook that provides calculation functionality without state management
 * This is a simpler hook that can be used by other components without introducing
 * circular dependencies or requiring state management
 */
export const useEmissionsCalculations = () => {
  // Simple function to calculate emissions based on inputs and scope
  const performCalculation = (
    inputs: EmissionsInput,
    scope?: 'scope1' | 'scope2' | 'scope3'
  ): { results: EmissionsResults; details: EmissionsDetails } => {
    console.log('Performing emissions calculation with inputs:', JSON.stringify(inputs), 'for scope:', scope);
    
    // Validate inputs before calculation
    if (!inputs) {
      console.error('Invalid inputs for calculation:', inputs);
      return {
        results: { scope1: 0, scope2: 0, scope3: 0, total: 0 },
        details: { scope1Details: '', scope2Details: '', scope3Details: '' }
      };
    }
    
    try {
      // Only validate scope-specific inputs depending on which scope we're calculating
      if (scope === 'scope1') {
        // Scope 1 validation
        if (!inputs.fuelType) {
          console.error('Missing fuelType for scope1 calculation');
          return {
            results: { scope1: 0, scope2: 0, scope3: 0, total: 0 },
            details: { scope1Details: '', scope2Details: '', scope3Details: '' }
          };
        }
        
        // Always handle fuel quantity as string, then parse it
        const quantityStr = String(inputs.fuelQuantity || '').replace(',', '.');
        const quantity = parseFloat(quantityStr);
        
        if (isNaN(quantity) || quantity <= 0) {
          console.error('Invalid fuelQuantity for scope1 calculation:', inputs.fuelQuantity);
          return {
            results: { scope1: 0, scope2: 0, scope3: 0, total: 0 },
            details: { scope1Details: '', scope2Details: '', scope3Details: '' }
          };
        }
      } 
      else if (scope === 'scope2') {
        // Scope 2 validation
        if (!inputs.energyType) {
          console.error('Missing energyType for scope2 calculation');
          return {
            results: { scope1: 0, scope2: 0, scope3: 0, total: 0 },
            details: { scope1Details: '', scope2Details: '', scope3Details: '' }
          };
        }
        
        // Parse energy quantity 
        const quantityStr = String(inputs.energyQuantity || '').replace(',', '.');
        const quantity = parseFloat(quantityStr);
        
        if (isNaN(quantity) || quantity <= 0) {
          console.error('Invalid energyQuantity for scope2 calculation:', inputs.energyQuantity);
          return {
            results: { scope1: 0, scope2: 0, scope3: 0, total: 0 },
            details: { scope1Details: '', scope2Details: '', scope3Details: '' }
          };
        }
      }
      else if (scope === 'scope3') {
        // Scope 3 validation logic based on category
        if (!inputs.scope3Category) {
          console.error('Missing scope3Category for scope3 calculation');
          return {
            results: { scope1: 0, scope2: 0, scope3: 0, total: 0 },
            details: { scope1Details: '', scope2Details: '', scope3Details: '' }
          };
        }
        
        // Additional validation based on category
        if (inputs.scope3Category === 'transport' && (!inputs.transportType || !inputs.transportDistance)) {
          console.error('Missing transport details for scope3 calculation');
          return {
            results: { scope1: 0, scope2: 0, scope3: 0, total: 0 },
            details: { scope1Details: '', scope2Details: '', scope3Details: '' }
          };
        } 
        else if (inputs.scope3Category === 'waste' && (!inputs.wasteType || !inputs.wasteQuantity)) {
          console.error('Missing waste details for scope3 calculation');
          return {
            results: { scope1: 0, scope2: 0, scope3: 0, total: 0 },
            details: { scope1Details: '', scope2Details: '', scope3Details: '' }
          };
        }
        else if (inputs.scope3Category === 'purchases' && (!inputs.purchaseType || !inputs.purchaseQuantity)) {
          console.error('Missing purchase details for scope3 calculation');
          return {
            results: { scope1: 0, scope2: 0, scope3: 0, total: 0 },
            details: { scope1Details: '', scope2Details: '', scope3Details: '' }
          };
        }
      }
      
      // Call the calculation function
      const calculationResult = performEmissionsCalculation(inputs, scope);
      
      return calculationResult;
    } catch (error) {
      console.error('Error during emissions calculation:', error);
      return {
        results: { scope1: 0, scope2: 0, scope3: 0, total: 0 },
        details: { scope1Details: '', scope2Details: '', scope3Details: '' }
      };
    }
  };
  
  return { performCalculation };
};
