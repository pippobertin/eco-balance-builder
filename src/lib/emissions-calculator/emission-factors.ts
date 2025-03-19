
import { EmissionFactor, EmissionFactorSource, EmissionScope } from '../emissions-types';

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
