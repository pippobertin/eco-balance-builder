
import { getEmissionFactorSource } from '@/lib/emissions-calculator';
import { EmissionsInput, EmissionsResults, EmissionsDetails } from './types';
import { 
  calculateScope1Emissions, 
  calculateScope2Emissions, 
  calculateScope3Emissions 
} from '@/lib/emissions-calculator';
import { 
  calculateVehicleEmissions, 
  createVehicleDetailsRecord 
} from '@/lib/vehicle-emissions';

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
        let vehicleDetails = null;
        
        console.log('Calcolo Scope 3 per trasporto:', {
          transportType: inputs.transportType,
          distance,
          vehicleDetails: {
            vehicleType: inputs.vehicleType,
            vehicleEnergyClass: inputs.vehicleEnergyClass,
            vehicleFuelType: inputs.vehicleFuelType,
            fuelConsumption: inputs.vehicleFuelConsumption,
            fuelConsumptionUnit: inputs.vehicleFuelConsumptionUnit
          }
        });
        
        // Check if we have vehicle details to use the vehicle emissions factors
        if (inputs.vehicleType && inputs.vehicleEnergyClass && inputs.vehicleFuelType) {
          // Use the vehicle emissions utility
          const fuelConsumption = inputs.vehicleFuelConsumption ? parseFloat(inputs.vehicleFuelConsumption) : null;
          
          const vehicleEmissions = calculateVehicleEmissions(
            inputs.vehicleType,
            inputs.vehicleEnergyClass,
            inputs.vehicleFuelType,
            distance,
            fuelConsumption && !isNaN(fuelConsumption) ? fuelConsumption : undefined,
            inputs.vehicleFuelConsumptionUnit as 'l_100km' | 'km_l'
          );
          
          emissionsKg = vehicleEmissions.emissionsKg;
          emissionSource = vehicleEmissions.source;
          
          console.log('Risultato calcolo emissioni veicolo:', {
            emissionsKg,
            emissionsSource: emissionSource,
            fuelConsumed: vehicleEmissions.fuelConsumed,
            consumptionFactorUsed: vehicleEmissions.consumptionFactorUsed
          });
          
          // Create vehicle details record
          vehicleDetails = createVehicleDetailsRecord(
            inputs.vehicleType,
            inputs.vehicleFuelType,
            inputs.vehicleEnergyClass,
            fuelConsumption && !isNaN(fuelConsumption) ? fuelConsumption : null,
            inputs.vehicleFuelConsumptionUnit || 'l_100km',
            vehicleEmissions.fuelConsumed > 0 ? vehicleEmissions.fuelConsumed : null,
            vehicleEmissions.consumptionFactorUsed > 0 ? vehicleEmissions.consumptionFactorUsed : null
          );
        } else {
          // Fallback to standard transport emission factors if vehicle details not provided
          emissionsKg = calculateScope3Emissions(
            inputs.transportType,
            distance,
            'km'
          );
          emissionSource = getEmissionFactorSource(inputs.transportType);
          
          console.log('Fallback al calcolo emissioni di trasporto standard:', {
            emissionsKg,
            emissionsSource: emissionSource
          });
        }
        
        // Assicuriamoci che emissionsKg sia un valore valido
        if (isNaN(emissionsKg) || !isFinite(emissionsKg)) {
          console.warn('Valore di emissione non valido, impostazione a 0');
          emissionsKg = 0;
        }
        
        // Converti da kg a tonnellate e aggiorna i risultati
        const emissionsTonnes = emissionsKg / 1000;
        results.scope3 = emissionsTonnes;
        
        console.log('Emissioni finali calcolate:', {
          emissionsKg,
          emissionsTonnes,
          scope3Total: results.scope3
        });
        
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
          source: emissionSource,
          // Add vehicle details to the calculation details if available
          vehicleDetails: vehicleDetails
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
  
  console.log('Risultati finali del calcolo delle emissioni:', {
    scope1: results.scope1,
    scope2: results.scope2,
    scope3: results.scope3,
    total: results.total
  });
  
  return { results, details };
};
