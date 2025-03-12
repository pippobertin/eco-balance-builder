
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

// Helper functions for styling
export const getStakeholderPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Alta':
      return 'bg-red-100 text-red-800';
    case 'Media':
      return 'bg-yellow-100 text-yellow-800';
    case 'Bassa':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getSurveyStatusColor = (status?: string) => {
  if (!status) return 'bg-gray-100 text-gray-800';
  
  switch (status) {
    case 'sent':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getSurveyStatusText = (status?: string) => {
  if (!status) return 'Non inviato';
  
  switch (status) {
    case 'sent':
      return 'Inviato';
    case 'completed':
      return 'Completato';
    case 'pending':
      return 'In attesa';
    default:
      return 'Non inviato';
  }
};
