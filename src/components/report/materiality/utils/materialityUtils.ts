
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
  'circular-economy',                  // Economia circolare
  // Add header IDs that might be used in the application
  'environmental',
  'social',
  'governance',
  'ambiente',
  'sociale',
  'governance-header',
  'cambiamenti climatici',
  'biodiversità ed ecosistemi',
  'inquinamento',
  'acque e risorse marine',
  'economia circolare',
  'forza lavoro propria',
  'lavoratori nella catena del valore',
  'comunità interessate',
  'consumatori e utilizzatori finali',
  'condotta delle imprese'
];

// Text patterns that indicate a header
const headerNamePatterns = [
  'cambiamenti climatici',
  'biodiversità ed ecosistemi',
  'inquinamento',
  'acque e risorse marine',
  'economia circolare',
  'forza lavoro propria',
  'lavoratori nella catena del valore',
  'comunità interessate',
  'consumatori e utilizzatori finali',
  'condotta delle imprese'
];

export const isHeaderTheme = (id: string, name?: string): boolean => {
  // Convert ID and name to lowercase for case-insensitive matching
  const lowercaseId = id.toLowerCase();
  const lowercaseName = name ? name.toLowerCase() : '';
  
  // First, direct match with themeHeaders array
  if (themeHeaders.includes(id)) return true;
  if (themeHeaders.includes(lowercaseId)) return true;
  
  // Check if name matches a header name pattern
  if (name && headerNamePatterns.includes(lowercaseName)) return true;
  
  // Check if it contains common header patterns
  if (lowercaseId.includes('header') || lowercaseId.includes('-header')) return true;
  
  // Check if it contains common category keywords
  if (lowercaseId.includes('category') || 
      lowercaseId.includes('section') || 
      lowercaseId.includes('group')) return true;
  
  // Check if it starts with common ESG prefixes followed by a dash
  if (lowercaseId.startsWith('environmental-') || 
      lowercaseId.startsWith('social-') || 
      lowercaseId.startsWith('governance-')) return true;
  
  // Check specific header names that have dedicated IDs
  if (
    lowercaseId === 'climate-change' || 
    lowercaseId === 'biodiversity' || 
    lowercaseId === 'pollution' || 
    lowercaseId === 'water-resources' || 
    lowercaseId === 'circular-economy'
  ) return true;
  
  // Check if the ID or name is a known header name
  return headerNamePatterns.some(pattern => 
    lowercaseId.includes(pattern.toLowerCase()) || 
    (name && lowercaseName.includes(pattern.toLowerCase()))
  );
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
