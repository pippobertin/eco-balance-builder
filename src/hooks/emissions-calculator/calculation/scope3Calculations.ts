
import { getEmissionFactorSource } from '@/lib/emissions-calculator';
import { EmissionsInput, EmissionsResults, EmissionsDetails } from '../types';
import { calculateTransportEmissions, calculateWasteEmissions, calculatePurchaseEmissions } from '@/lib/emissions-calculator';
import { calculateVehicleEmissions } from '@/lib/vehicle-emissions';

/**
 * Perform transport calculations for Scope 3
 */
export const performTransportCalculation = (
  inputs: EmissionsInput,
  results: EmissionsResults
): { 
  updatedResults: EmissionsResults; 
  details: string;
  source?: string;
} => {
  let details = '';
  let source = '';
  
  // Check if we're calculating vehicle-based emissions
  if (inputs.vehicleType && inputs.vehicleFuelType && inputs.transportType) {
    // Vehicle emissions calculation (with fuel consumption)
    if (inputs.vehicleFuelConsumption && inputs.transportDistance) {
      const fuelConsumption = parseFloat(inputs.vehicleFuelConsumption);
      const distance = parseFloat(inputs.transportDistance);
      
      if (!isNaN(fuelConsumption) && !isNaN(distance) && fuelConsumption > 0 && distance > 0) {
        console.log("Calculating vehicle emissions for:", {
          vehicleType: inputs.vehicleType,
          fuelType: inputs.vehicleFuelType,
          fuelConsumption,
          distance,
          unit: inputs.vehicleFuelConsumptionUnit || 'l_100km'
        });
        
        const emissionsResult = calculateVehicleEmissions({
          vehicleType: inputs.vehicleType,
          fuelType: inputs.vehicleFuelType,
          fuelConsumption,
          distance,
          consumptionUnit: inputs.vehicleFuelConsumptionUnit || 'l_100km'
        });
        
        if (emissionsResult && emissionsResult.emissionsKg > 0) {
          console.log("Vehicle emissions calculated:", emissionsResult);
          
          const emissionsTonnes = emissionsResult.emissionsKg / 1000;
          
          // Update results
          const updatedResults = {
            ...results,
            scope3: emissionsTonnes
          };
          
          // Save calculation details
          const calculationDetails = {
            transportType: inputs.transportType,
            vehicleType: inputs.vehicleType,
            vehicleFuelType: inputs.vehicleFuelType,
            fuelConsumption,
            consumptionUnit: inputs.vehicleFuelConsumptionUnit || 'l_100km',
            distance,
            distanceUnit: 'km',
            periodType: inputs.periodType,
            emissionsKg: emissionsResult.emissionsKg,
            emissionsTonnes,
            calculationDate: new Date().toISOString(),
            source: getEmissionFactorSource(inputs.vehicleFuelType)
          };
          
          details = JSON.stringify(calculationDetails);
          source = calculationDetails.source;
          
          return { updatedResults, details, source };
        } else {
          console.warn("Vehicle emissions calculation returned zero or invalid result:", emissionsResult);
        }
      }
    } 
    // If we don't have fuel consumption but have distance, use simplified transport calculation
    else if (inputs.transportDistance) {
      const distance = parseFloat(inputs.transportDistance);
      
      if (!isNaN(distance) && distance > 0) {
        const emissionsKg = calculateTransportEmissions(
          inputs.transportType || 'BUSINESS_TRAVEL_CAR', 
          distance
        );
        const emissionsTonnes = emissionsKg / 1000;
        
        // Update results
        const updatedResults = {
          ...results,
          scope3: emissionsTonnes
        };
        
        // Save calculation details
        const calculationDetails = {
          transportType: inputs.transportType,
          distance,
          distanceUnit: 'km',
          periodType: inputs.periodType,
          emissionsKg,
          emissionsTonnes,
          calculationDate: new Date().toISOString(),
          source: getEmissionFactorSource(inputs.transportType || 'BUSINESS_TRAVEL_CAR')
        };
        
        details = JSON.stringify(calculationDetails);
        source = calculationDetails.source;
        
        return { updatedResults, details, source };
      }
    }
  } 
  // Standard transport emissions (no vehicle details)
  else if (inputs.transportType && inputs.transportDistance) {
    const distance = parseFloat(inputs.transportDistance);
    
    if (!isNaN(distance) && distance > 0) {
      const emissionsKg = calculateTransportEmissions(
        inputs.transportType, 
        distance
      );
      const emissionsTonnes = emissionsKg / 1000;
      
      // Update results
      const updatedResults = {
        ...results,
        scope3: emissionsTonnes
      };
      
      // Save calculation details
      const calculationDetails = {
        transportType: inputs.transportType,
        distance,
        distanceUnit: 'km',
        periodType: inputs.periodType,
        emissionsKg,
        emissionsTonnes,
        calculationDate: new Date().toISOString(),
        source: getEmissionFactorSource(inputs.transportType)
      };
      
      details = JSON.stringify(calculationDetails);
      source = calculationDetails.source;
      
      return { updatedResults, details, source };
    }
  }
  
  return { updatedResults: results, details };
};

/**
 * Perform waste calculations for Scope 3
 */
export const performWasteCalculation = (
  inputs: EmissionsInput,
  results: EmissionsResults
): { 
  updatedResults: EmissionsResults; 
  details: string;
  source?: string;
} => {
  let details = '';
  let source = '';

  if (inputs.wasteType && inputs.wasteQuantity && inputs.wasteQuantity !== '') {
    const quantity = parseFloat(inputs.wasteQuantity);
    if (!isNaN(quantity) && quantity > 0) {
      const emissionsKg = calculateWasteEmissions(
        inputs.wasteType, 
        quantity
      );
      const emissionsTonnes = emissionsKg / 1000;
      
      // Update results
      const updatedResults = {
        ...results,
        scope3: emissionsTonnes
      };
      
      // Save calculation details
      const calculationDetails = {
        wasteType: inputs.wasteType,
        quantity,
        unit: 'kg',
        periodType: inputs.periodType,
        emissionsKg,
        emissionsTonnes,
        calculationDate: new Date().toISOString(),
        source: getEmissionFactorSource(inputs.wasteType)
      };
      
      details = JSON.stringify(calculationDetails);
      source = calculationDetails.source;
      
      return { updatedResults, details, source };
    }
  }
  
  return { updatedResults: results, details };
};

/**
 * Perform purchase calculations for Scope 3
 */
export const performPurchaseCalculation = (
  inputs: EmissionsInput,
  results: EmissionsResults
): { 
  updatedResults: EmissionsResults; 
  details: string; 
  source?: string;
} => {
  let details = '';
  let source = '';

  if (inputs.purchaseType && inputs.purchaseQuantity && inputs.purchaseQuantity !== '') {
    const quantity = parseFloat(inputs.purchaseQuantity);
    if (!isNaN(quantity) && quantity > 0) {
      const emissionsKg = calculatePurchaseEmissions(
        inputs.purchaseType, 
        quantity
      );
      const emissionsTonnes = emissionsKg / 1000;
      
      // Update results
      const updatedResults = {
        ...results,
        scope3: emissionsTonnes
      };
      
      // Save calculation details
      const calculationDetails = {
        purchaseType: inputs.purchaseType,
        description: inputs.purchaseDescription || '',
        quantity,
        unit: inputs.purchaseType === 'PURCHASED_GOODS' ? 'kg' : 'unità',
        periodType: inputs.periodType,
        emissionsKg,
        emissionsTonnes,
        calculationDate: new Date().toISOString(),
        source: getEmissionFactorSource(inputs.purchaseType)
      };
      
      details = JSON.stringify(calculationDetails);
      source = calculationDetails.source;
      
      return { updatedResults, details, source };
    }
  }
  
  return { updatedResults: results, details };
};

/**
 * Perform Scope 3 emissions calculation
 */
export const performScope3Calculation = (
  inputs: EmissionsInput,
  results: EmissionsResults
): { 
  updatedResults: EmissionsResults; 
  details: string;
  source?: string;
} => {
  // Determine which category of Scope 3 we're calculating
  const category = inputs.scope3Category || 'transport';
  
  if (category === 'transport') {
    return performTransportCalculation(inputs, results);
  } else if (category === 'waste') {
    return performWasteCalculation(inputs, results);
  } else if (category === 'purchases') {
    return performPurchaseCalculation(inputs, results);
  }
  
  // Default return if no calculations performed
  return { updatedResults: results, details: '' };
};
