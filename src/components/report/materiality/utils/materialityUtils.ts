
export * from './stakeholderUtils';
export * from './surveyUtils';
export * from './predefinedIssues';
export * from './iroData';
export * from './esgCategoryUtils';

// Main theme headers that should not be selectable
const themeHeaders = [
  'environmental-climate-header',      // Cambiamenti climatici
  'environmental-pollution-header',    // Inquinamento
  'environmental-water-header',        // Acque e risorse marine
  'environmental-biodiversity-header', // Biodiversità ed ecosistemi
  'environmental-circular-header',     // Economia circolare
  'social-workforce-header',           // Forza lavoro propria
  'social-value-chain-header',         // Lavoratori nella catena del valore
  'social-communities-header',         // Comunità interessate
  'social-consumers-header',           // Consumatori e utilizzatori finali
  'governance-conduct-header'          // Condotta delle imprese
];

export const isHeaderTheme = (id: string): boolean => {
  return themeHeaders.includes(id);
};
