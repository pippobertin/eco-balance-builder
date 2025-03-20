
import { FuelType } from '../emissions-types';
import { EMISSION_FACTORS } from './emission-factors';
import { UNIT_CONVERSIONS } from './emission-converters';

/**
 * Calcola le emissioni di CO2 per Scope 1 (emissioni dirette da combustione di combustibili)
 * @param fuelType - Tipo di combustibile utilizzato
 * @param quantity - Quantità di combustibile
 * @param unit - Unità di misura
 * @returns - Emissioni di CO2 in kgCO2e
 */
export const calculateScope1Emissions = (
  fuelType: FuelType,
  quantity: number,
  unit: string
): number => {
  console.log('calculateScope1Emissions called with:', { fuelType, quantity, unit });
  
  // Ottieni il fattore di emissione per il tipo di combustibile
  const emissionFactor = EMISSION_FACTORS[fuelType];
  
  if (!emissionFactor) {
    console.warn(`Fattore di emissione non trovato per il tipo di combustibile: ${fuelType}`);
    return 0;
  }
  
  // Ottieni il fattore di conversione per l'unità
  const conversionFactor = UNIT_CONVERSIONS.FUEL[unit] || 1;
  console.log('Using emission factor:', emissionFactor.value, 'and conversion factor:', conversionFactor);
  
  // Calcola le emissioni
  const standardizedQuantity = quantity * conversionFactor;
  const emissions = emissionFactor.value * standardizedQuantity;
  
  console.log('Calculated emissions:', {
    standardizedQuantity,
    emissions
  });
  
  return emissions;
};
