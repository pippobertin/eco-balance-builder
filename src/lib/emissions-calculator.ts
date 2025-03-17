
import { EmissionFactor, EmissionFactorSource, EmissionScope, FuelType, EnergyType, TransportType, WasteType, PurchaseType } from './emissions-types';

// Fattori di emissione provenienti da IPCC, DEFRA e ISPRA
// Valori in kgCO2e per unità specificata
export const EMISSION_FACTORS: Record<string, EmissionFactor> = {
  // Scope 1 - Tipi di combustibile
  DIESEL: { 
    value: 2.68, 
    unit: 'kg/L',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE1,
    description: 'Gasolio (Diesel)'
  },
  GASOLINE: { 
    value: 2.31, 
    unit: 'kg/L',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE1,
    description: 'Benzina'
  },
  NATURAL_GAS: { 
    value: 2.02, 
    unit: 'kg/m³',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE1,
    description: 'Gas naturale'
  },
  LPG: { 
    value: 1.51, 
    unit: 'kg/L',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE1,
    description: 'GPL'
  },
  BIOMASS_PELLET: { 
    value: 0.04, 
    unit: 'kg/kg',
    source: EmissionFactorSource.IPCC,
    scope: EmissionScope.SCOPE1,
    description: 'Pellet di legno (biomassa)'
  },
  BIOMASS_WOOD: { 
    value: 0.03, 
    unit: 'kg/kg',
    source: EmissionFactorSource.IPCC,
    scope: EmissionScope.SCOPE1,
    description: 'Legna da ardere (biomassa)'
  },
  BIOFUEL: { 
    value: 1.13, 
    unit: 'kg/L',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE1,
    description: 'Biocombustibili'
  },
  COAL: { 
    value: 2.42, 
    unit: 'kg/kg',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE1,
    description: 'Carbone'
  },
  FUEL_OIL: { 
    value: 3.17, 
    unit: 'kg/L',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE1,
    description: 'Olio combustibile'
  },
  
  // Scope 2 - Tipi di energia
  ELECTRICITY_IT: { 
    value: 0.233, 
    unit: 'kg/kWh',
    source: EmissionFactorSource.ISPRA,
    scope: EmissionScope.SCOPE2,
    description: 'Elettricità da rete (Italia)'
  },
  ELECTRICITY_EU: { 
    value: 0.256, 
    unit: 'kg/kWh',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE2,
    description: 'Elettricità da rete (media UE)'
  },
  ELECTRICITY_RENEWABLE: { 
    value: 0.0, 
    unit: 'kg/kWh',
    source: EmissionFactorSource.ISPRA,
    scope: EmissionScope.SCOPE2,
    description: 'Energia rinnovabile (solare, eolica)'
  },
  ELECTRICITY_COGENERATION: { 
    value: 0.181, 
    unit: 'kg/kWh',
    source: EmissionFactorSource.ISPRA,
    scope: EmissionScope.SCOPE2,
    description: 'Cogenerazione/Energia termoelettrica combinata'
  },
  
  // Scope 3 - Trasporto e altre emissioni indirette
  FREIGHT_ROAD: { 
    value: 0.107, 
    unit: 'kg/t·km',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE3,
    description: 'Trasporto merci su strada (camion medio)'
  },
  FREIGHT_RAIL: { 
    value: 0.028, 
    unit: 'kg/t·km',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE3,
    description: 'Trasporto merci su rotaia'
  },
  FREIGHT_SEA: { 
    value: 0.015, 
    unit: 'kg/t·km',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE3,
    description: 'Trasporto merci via mare'
  },
  FREIGHT_AIR: { 
    value: 0.654, 
    unit: 'kg/t·km',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE3,
    description: 'Trasporto merci aereo'
  },
  BUSINESS_TRAVEL_CAR: { 
    value: 0.17, 
    unit: 'kg/km',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE3,
    description: 'Viaggi di lavoro - auto (media)'
  },
  BUSINESS_TRAVEL_TRAIN: { 
    value: 0.03, 
    unit: 'kg/km',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE3,
    description: 'Viaggi di lavoro - treno'
  },
  BUSINESS_TRAVEL_FLIGHT_SHORT: { 
    value: 0.154, 
    unit: 'kg/km',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE3,
    description: 'Viaggi di lavoro - volo breve (<1500km)'
  },
  BUSINESS_TRAVEL_FLIGHT_LONG: { 
    value: 0.114, 
    unit: 'kg/km',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE3,
    description: 'Viaggi di lavoro - volo lungo (>1500km)'
  },
  WASTE_LANDFILL: { 
    value: 458, 
    unit: 'kg/t',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE3,
    description: 'Smaltimento rifiuti - discarica (generale)'
  },
  WASTE_RECYCLED: { 
    value: 21, 
    unit: 'kg/t',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE3,
    description: 'Smaltimento rifiuti - riciclaggio (media)'
  },
  WASTE_INCINERATION: { 
    value: 21.3, 
    unit: 'kg/t',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE3,
    description: 'Smaltimento rifiuti - incenerimento'
  }
};

// Fattori di conversione delle unità per standardizzare gli input
export const UNIT_CONVERSIONS: Record<string, Record<string, number>> = {
  // Conversioni per combustibili
  FUEL: {
    'L': 1, // litro (unità base)
    'kL': 1000, // kilolitro a litro
    'gal': 3.78541, // gallone US a litro
    'kg': 1, // kg (per combustibili solidi - unità base)
    't': 1000, // tonnellata metrica a kg
    'm³': 1, // metro cubo (per gas - unità base)
    'ft³': 0.0283168, // piedi cubi a metro cubo
    'kWh': 1, // kWh (per contenuto energetico - unità base)
    'MWh': 1000, // MWh a kWh
    'GJ': 277.778 // GJ a kWh
  },
  
  // Conversioni per energia
  ENERGY: {
    'kWh': 1, // kWh (unità base)
    'MWh': 1000, // MWh a kWh
    'GWh': 1000000, // GWh a kWh
    'GJ': 277.778 // GJ a kWh
  },
  
  // Conversioni per trasporti
  TRANSPORT: {
    'km': 1, // chilometro (unità base)
    'mi': 1.60934, // miglia a km
    't·km': 1, // tonnellata-chilometro (unità base per trasporto merci)
    'kg·km': 0.001 // kg-chilometro a tonnellata-chilometro
  },
  
  // Conversioni per rifiuti
  WASTE: {
    'kg': 0.001, // kg a tonnellate
    't': 1 // tonnellate (unità base)
  }
};

// Percentuali di mix energetico per diversi paesi (per calcoli Scope 2)
export const ENERGY_MIX = {
  IT: {
    renewable: 0.41, // 41% rinnovabile in Italia (esempio)
    fossil: 0.59
  },
  EU: {
    renewable: 0.38, // 38% rinnovabile nella media UE (esempio)
    fossil: 0.62
  }
};

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
  // Ottieni il fattore di emissione per il tipo di combustibile
  const emissionFactor = EMISSION_FACTORS[fuelType];
  
  if (!emissionFactor) {
    console.warn(`Fattore di emissione non trovato per il tipo di combustibile: ${fuelType}`);
    return 0;
  }
  
  // Ottieni il fattore di conversione per l'unità
  const conversionFactor = UNIT_CONVERSIONS.FUEL[unit] || 1;
  
  // Calcola le emissioni
  const standardizedQuantity = quantity * conversionFactor;
  const emissions = emissionFactor.value * standardizedQuantity;
  
  return emissions;
};

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

/**
 * Ottieni informazioni sulla fonte per un fattore di emissione
 * @param factorKey - Chiave del fattore di emissione
 * @returns - Informazioni sulla fonte inclusi nome, URL e anno di riferimento
 */
export const getEmissionFactorSource = (factorKey: string) => {
  const factor = EMISSION_FACTORS[factorKey];
  if (!factor) return null;
  
  const sourceUrls = {
    [EmissionFactorSource.IPCC]: 'https://www.ipcc-nggip.iges.or.jp/EFDB/main.php',
    [EmissionFactorSource.DEFRA]: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023',
    [EmissionFactorSource.ISPRA]: 'https://www.isprambiente.gov.it/it/pubblicazioni/manuali-e-linee-guida/fattori-emissione-in-atmosfera'
  };
  
  return {
    name: factor.source,
    url: sourceUrls[factor.source],
    year: '2023' // Aggiorna questo quando usi un anno di riferimento diverso
  };
};

/**
 * Ottieni tutti i tipi di combustibile disponibili
 */
export const getAvailableFuelTypes = (): {value: string, label: string}[] => {
  return Object.entries(EMISSION_FACTORS)
    .filter(([_, factor]) => factor.scope === EmissionScope.SCOPE1)
    .map(([key, factor]) => ({
      value: key,
      label: factor.description
    }));
};

/**
 * Ottieni tutti i tipi di energia disponibili
 */
export const getAvailableEnergyTypes = (): {value: string, label: string}[] => {
  return Object.entries(EMISSION_FACTORS)
    .filter(([_, factor]) => factor.scope === EmissionScope.SCOPE2)
    .map(([key, factor]) => ({
      value: key,
      label: factor.description
    }));
};

/**
 * Ottieni tutti i tipi di attività Scope 3 disponibili
 */
export const getAvailableScope3Types = (): {value: string, label: string}[] => {
  return Object.entries(EMISSION_FACTORS)
    .filter(([_, factor]) => factor.scope === EmissionScope.SCOPE3)
    .map(([key, factor]) => ({
      value: key,
      label: factor.description
    }));
};

/**
 * Ottieni le unità disponibili per una categoria specifica
 */
export const getAvailableUnits = (category: 'FUEL' | 'ENERGY' | 'TRANSPORT' | 'WASTE'): {value: string, label: string}[] => {
  return Object.keys(UNIT_CONVERSIONS[category]).map(unit => ({
    value: unit,
    label: unit
  }));
};
