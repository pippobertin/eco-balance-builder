
import { EnergyType } from '../emissions-types';
import { EMISSION_FACTORS } from './emission-factors';
import { UNIT_CONVERSIONS } from './emission-converters';
import { ENERGY_MIX } from './emission-factors';

/**
 * Calcola le emissioni di CO2 per Scope 2 (emissioni indirette da energia acquistata)
 * @param energyType - Tipo di energia
 * @param quantity - Quantità di energia
 * @param unit - Unità di misura
 * @param renewablePercentage - Opzionale: percentuale di energia da fonti rinnovabili (0-1)
 * @returns - Emissioni di CO2 in kgCO2e
 */
export const calculateScope2Emissions = (
  energyType: EnergyType,
  quantity: number,
  unit: string,
  renewablePercentage?: number
): number => {
  // Ottieni il fattore di emissione per il tipo di energia
  const emissionFactor = EMISSION_FACTORS[energyType];
  
  if (!emissionFactor) {
    console.warn(`Fattore di emissione non trovato per il tipo di energia: ${energyType}`);
    return 0;
  }
  
  // Ottieni il fattore di conversione per l'unità
  const conversionFactor = UNIT_CONVERSIONS.ENERGY[unit] || 1;
  
  // Calcola la quantità standardizzata
  const standardizedQuantity = quantity * conversionFactor;
  
  // Applica la percentuale rinnovabile se fornita (per elettricità da rete mista)
  let adjustedEmissionFactor = emissionFactor.value;
  if (renewablePercentage !== undefined && (energyType === 'ELECTRICITY_IT' || energyType === 'ELECTRICITY_EU')) {
    // Applica media ponderata basata sulla percentuale rinnovabile
    const fossilFactor = adjustedEmissionFactor / (1 - (energyType === 'ELECTRICITY_IT' ? ENERGY_MIX.IT.renewable : ENERGY_MIX.EU.renewable));
    adjustedEmissionFactor = fossilFactor * (1 - renewablePercentage);
  }
  
  // Calcola le emissioni
  const emissions = adjustedEmissionFactor * standardizedQuantity;
  
  return emissions;
};
