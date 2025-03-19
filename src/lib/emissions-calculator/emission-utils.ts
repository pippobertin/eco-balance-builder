
import { EmissionFactorSource } from '../emissions-types';
import { EMISSION_FACTORS } from './emission-factors';

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
    .filter(([_, factor]) => factor.scope === 'Scope 1')
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
    .filter(([_, factor]) => factor.scope === 'Scope 2')
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
    .filter(([_, factor]) => factor.scope === 'Scope 3')
    .map(([key, factor]) => ({
      value: key,
      label: factor.description
    }));
};

/**
 * Ottieni le unità disponibili per una categoria specifica
 */
export const getAvailableUnits = (category: 'FUEL' | 'ENERGY' | 'TRANSPORT' | 'WASTE'): {value: string, label: string}[] => {
  const unitConversions = require('./emission-converters').UNIT_CONVERSIONS;
  return Object.keys(unitConversions[category]).map(unit => ({
    value: unit,
    label: unit
  }));
};
