
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
