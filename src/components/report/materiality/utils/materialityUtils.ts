
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
  'governance-conduct-header',         // Condotta delle imprese
  // Adding plain text headers too
  'climate-change',                    // Cambiamenti climatici
  'biodiversity',                      // Biodiversità
  'pollution',                         // Inquinamento
  'water-resources',                   // Risorse idriche
  'circular-economy'                   // Economia circolare
];

export const isHeaderTheme = (id: string): boolean => {
  // Check if it's in the themeHeaders array
  if (themeHeaders.includes(id)) return true;
  
  // Also check for names that are common headers
  const headerNames = ['Cambiamenti climatici', 'Biodiversità ed ecosistemi', 'Inquinamento', 
                     'Acque e risorse marine', 'Economia circolare', 'Governance'];
  
  // If the ID contains any of these patterns, it's likely a header
  return id.toLowerCase().includes('header') || 
         id.toLowerCase().includes('-header') ||
         headerNames.some(name => id.toLowerCase().includes(name.toLowerCase()));
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
