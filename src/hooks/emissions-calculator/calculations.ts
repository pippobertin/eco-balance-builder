
import { getEmissionFactorSource } from '@/lib/emissions-calculator';
import { EmissionsInput, EmissionsResults, EmissionsDetails } from './types';
import { 
  calculateScope1Emissions, 
  calculateScope2Emissions, 
  calculateScope3Emissions 
} from '@/lib/emissions-calculator';
import { getVehicleEmissionFactor, getVehicleEmissionFactorSource } from '@/lib/vehicle-emissions-factors';

export const performEmissionsCalculation = (
  inputs: EmissionsInput,
  scope?: 'scope1' | 'scope2' | 'scope3'
): { results: EmissionsResults; details: EmissionsDetails } => {
  const results: EmissionsResults = {
    scope1: 0,
    scope2: 0,
    scope3: 0,
    total: 0
  };
  
  const details: EmissionsDetails = {
    scope1Details: '',
    scope2Details: '',
    scope3Details: ''
  };
  
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
        results.scope1 = emissionsTonnes;
        
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
        
        details.scope1Details = JSON.stringify(calculationDetails);
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
        results.scope2 = emissionsTonnes;
        
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
        
        details.scope2Details = JSON.stringify(calculationDetails);
      }
    }
  }
  
  // Calculate Scope 3 emissions if requested or not specified
  if (!scope || scope === 'scope3') {
    if (inputs.scope3Category === 'transport' && inputs.transportType && inputs.transportDistance && inputs.transportDistance !== '') {
      const distance = parseFloat(inputs.transportDistance);
      if (!isNaN(distance) && distance > 0) {
        let emissionsKg;
        let emissionSource;
        let fuelConsumed = 0;
        let consumptionFactor = 0;
        
        // Check if we have vehicle details to use the vehicle emissions factors
        if (inputs.vehicleType && inputs.vehicleEnergyClass && inputs.vehicleFuelType) {
          // Get emission factor from vehicle database in g CO2e/km
          const emissionFactor = getVehicleEmissionFactor(
            inputs.vehicleType,
            inputs.vehicleEnergyClass,
            inputs.vehicleFuelType
          );
          
          // Calculate emissions based on distance and vehicle-specific emission factor
          // Convert g CO2e/km to kg CO2e for the total distance
          
          // Apply fuel consumption if available
          if (inputs.vehicleFuelConsumption && inputs.vehicleFuelConsumptionUnit) {
            const consumption = parseFloat(inputs.vehicleFuelConsumption);
            
            if (!isNaN(consumption) && consumption > 0) {
              // Convert consumption to L/100km for calculation
              if (inputs.vehicleFuelConsumptionUnit === 'km_l') {
                // From km/L to L/100km
                consumptionFactor = 100 / consumption;
              } else {
                // Already in L/100km
                consumptionFactor = consumption;
              }
              
              // Calculate total fuel consumed for the journey in liters
              fuelConsumed = (distance * consumptionFactor) / 100;
              
              // Calculate emissions based on the theoretical fuel consumption
              if (inputs.vehicleFuelType === 'ELECTRIC') {
                // For electric vehicles, still use the emission factor per km
                emissionsKg = (emissionFactor * distance) / 1000;
              } else {
                // For fuel-based vehicles, use combination of distance-based and consumption-based calculation
                // Fuel-specific emission factor (kg CO2e/L) - simplified values
                const fuelEmissionFactors: Record<string, number> = {
                  'DIESEL': 2.68,
                  'GASOLINE': 2.31,
                  'LPG': 1.51,
                  'NATURAL_GAS': 2.02,
                  'BIOFUEL': 1.13,
                  'HYBRID': 1.90, // Average between gasoline and electric
                  'ELECTRIC': 0 // Electric doesn't use fuel in the same way
                };
                
                const fuelSpecificFactor = fuelEmissionFactors[inputs.vehicleFuelType] || 2.31; // Default to gasoline if not found
                
                // Calculate emissions based on fuel consumed
                emissionsKg = fuelConsumed * fuelSpecificFactor;
              }
            } else {
              // Fallback to standard calculation if consumption is invalid
              emissionsKg = (emissionFactor * distance) / 1000;
            }
          } else {
            // Standard calculation without consumption data
            emissionsKg = (emissionFactor * distance) / 1000;
          }
          
          emissionSource = getVehicleEmissionFactorSource(
            inputs.vehicleType,
            inputs.vehicleEnergyClass,
            inputs.vehicleFuelType
          );
        } else {
          // Fallback to standard transport emission factors if vehicle details not provided
          emissionsKg = calculateScope3Emissions(
            inputs.transportType,
            distance,
            'km'
          );
          emissionSource = getEmissionFactorSource(inputs.transportType);
        }
        
        const emissionsTonnes = emissionsKg / 1000;
        results.scope3 = emissionsTonnes;
        
        // Save calculation details, now including vehicle information and fuel consumption
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
          source: emissionSource,
          // Add vehicle details to the calculation details
          vehicleDetails: {
            vehicleType: inputs.vehicleType || '',
            vehicleFuelType: inputs.vehicleFuelType || 'DIESEL',
            vehicleEnergyClass: inputs.vehicleEnergyClass || '',
            fuelConsumption: inputs.vehicleFuelConsumption ? parseFloat(inputs.vehicleFuelConsumption) : null,
            fuelConsumptionUnit: inputs.vehicleFuelConsumptionUnit || 'l_100km',
            totalFuelConsumed: fuelConsumed > 0 ? fuelConsumed : null,
            consumptionFactorUsed: consumptionFactor > 0 ? consumptionFactor : null,
            emissionFactor: inputs.vehicleType && inputs.vehicleEnergyClass && inputs.vehicleFuelType ? 
              getVehicleEmissionFactor(inputs.vehicleType, inputs.vehicleEnergyClass, inputs.vehicleFuelType) : null
          }
        };
        
        details.scope3Details = JSON.stringify(calculationDetails);
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
        results.scope3 = emissionsTonnes;
        
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
        
        details.scope3Details = JSON.stringify(calculationDetails);
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
        results.scope3 = emissionsTonnes;
        
        // Save calculation details, now including purchase description
        const calculationDetails = {
          activityType: inputs.purchaseType,
          quantity,
          unit: inputs.purchaseType === 'PURCHASED_GOODS' ? 'kg' : 'unit',
          periodType: inputs.periodType,
          emissionsKg,
          emissionsTonnes,
          calculationDate: new Date().toISOString(),
          source: getEmissionFactorSource(inputs.purchaseType),
          description: inputs.purchaseDescription || ''
        };
        
        details.scope3Details = JSON.stringify(calculationDetails);
      }
    }
  }
  
  // Calculate total emissions
  results.total = results.scope1 + results.scope2 + results.scope3;
  
  return { results, details };
};
