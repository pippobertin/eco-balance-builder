
import { EMISSION_FACTORS } from './emission-factors';
import { UNIT_CONVERSIONS } from './emission-converters';

/**
 * Calcola le emissioni di CO2 per Scope 3 (altre emissioni indirette)
 * @param activityType - Tipo di attività (trasporto, rifiuti, ecc.)
 * @param quantity - Quantità primaria (distanza, peso, ecc.)
 * @param unit - Unità di misura
 * @param secondaryQuantity - Opzionale: Quantità secondaria (es., peso per trasporto merci)
 * @param secondaryUnit - Opzionale: Unità per quantità secondaria
 * @returns - Emissioni di CO2 in kgCO2e
 */
export const calculateScope3Emissions = (
  activityType: string,
  quantity: number,
  unit: string,
  secondaryQuantity?: number,
  secondaryUnit?: string
): number => {
  // Ottieni il fattore di emissione per il tipo di attività
  const emissionFactor = EMISSION_FACTORS[activityType];
  
  if (!emissionFactor) {
    console.warn(`Fattore di emissione non trovato per il tipo di attività: ${activityType}`);
    return 0;
  }
  
  // Determina la categoria in base al tipo di attività
  let category = 'TRANSPORT';
  if (activityType.startsWith('WASTE')) {
    category = 'WASTE';
  }
  
  // Ottieni il fattore di conversione per l'unità
  const conversionFactor = UNIT_CONVERSIONS[category][unit] || 1;
  
  // Calcola la quantità standardizzata
  let standardizedQuantity = quantity * conversionFactor;
  
  // Per il trasporto merci, dobbiamo considerare peso e distanza
  if (activityType.startsWith('FREIGHT') && secondaryQuantity && secondaryUnit) {
    const secondaryConversionFactor = UNIT_CONVERSIONS.WASTE[secondaryUnit] || 1;
    const standardizedSecondaryQuantity = secondaryQuantity * secondaryConversionFactor;
    standardizedQuantity *= standardizedSecondaryQuantity;
  }
  
  // Calcola le emissioni
  const emissions = emissionFactor.value * standardizedQuantity;
  
  return emissions;
};
