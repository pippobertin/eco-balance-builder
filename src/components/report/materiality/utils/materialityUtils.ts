export * from './stakeholderUtils';
export * from './surveyUtils';
export * from './predefinedIssues';
export * from './iroData';
export * from './esgCategoryUtils';

// Main theme headers that should not be selectable
const themeHeaders = [
  // Environmental headers
  'environmental-climate-header',      // Cambiamenti climatici
  'environmental-pollution-header',    // Inquinamento
  'environmental-water-header',        // Acque e risorse marine
  'environmental-biodiversity-header', // Biodiversità ed ecosistemi
  'environmental-circular-header',     // Economia circolare
  
  // Social headers
  'social-workforce-header',           // Forza lavoro propria
  'social-value-chain-header',         // Lavoratori nella catena del valore
  'social-communities-header',         // Comunità interessate
  'social-consumers-header',           // Consumatori e utilizzatori finali
  
  // Governance headers
  'governance-conduct-header',         // Condotta delle imprese
  
  // Plain text headers
  'climate-change',                    // Cambiamenti climatici
  'biodiversity',                      // Biodiversità
  'pollution',                         // Inquinamento
  'water-resources',                   // Risorse idriche
  'circular-economy',                  // Economia circolare
  
  // Generic category headers
  'environmental',
  'social',
  'governance',
  'ambiente',
  'sociale',
  'governance-header',
  
  // Exact Italian header names
  'cambiamenti climatici',
  'biodiversità ed ecosistemi',
  'inquinamento',
  'acque e risorse marine',
  'economia circolare',
  'forza lavoro propria',
  'lavoratori nella catena del valore',
  'comunità interessate',
  'consumatori e utilizzatori finali',
  'condotta delle imprese',
  
  // Additional sub-headers in biodiversity section
  'biodiversity-climate',           // Cambiamenti climatici (biodiversità)
  'biodiversity-land-use',          // Cambiamento di uso del suolo
  'biodiversity-exploitation',      // Sfruttamento diretto
  'biodiversity-species',           // Specie esotiche invasive
  'biodiversity-pollution',         // Inquinamento (biodiversità)
  'biodiversity-other',             // Altro
  
  // Headers for species
  'species-population',             // Dimensione della popolazione
  'species-extinction',             // Rischio di estinzione
  
  // Headers for ecosystem impacts
  'ecosystem-soil',                 // Degrado del suolo
  'ecosystem-desertification',      // Desertificazione
  'ecosystem-impermeability',       // Impermeabilizzazione
  'ecosystem-services'              // Servizi ecosistemici
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
  'condotta delle imprese',
  'diritti economici',  // Comunità interessate - alternative name
  'consumatori e utilizzatori' // Alternative for consumers
];

export const isHeaderTheme = (id: string, name?: string): boolean => {
  // Convert ID and name to lowercase for case-insensitive matching
  const lowercaseId = id.toLowerCase();
  const lowercaseName = name ? name.toLowerCase() : '';
  
  // First, direct match with themeHeaders array
  if (themeHeaders.includes(id)) return true;
  if (themeHeaders.includes(lowercaseId)) return true;
  
  // Check if name matches a header name pattern exactly
  if (name && headerNamePatterns.some(pattern => lowercaseName === pattern)) return true;
  
  // Check exact matches for main category headers
  if (name === 'Cambiamenti climatici' || 
      name === 'Biodiversità ed ecosistemi' ||
      name === 'Inquinamento' ||
      name === 'Acque e risorse marine' ||
      name === 'Economia circolare' ||
      name === 'Forza lavoro propria' ||
      name === 'Lavoratori nella catena del valore' ||
      name === 'Comunità interessate' ||
      name === 'Consumatori e utilizzatori finali' ||
      name === 'Condotta delle imprese') {
    return true;
  }
  
  // Check if it contains common header patterns
  if (lowercaseId.includes('header') || lowercaseId.includes('-header')) return true;
  
  // Check if it contains common category keywords
  if (lowercaseId.includes('category') || 
      lowercaseId.includes('section') || 
      lowercaseId.includes('group')) return true;
  
  // Check if it starts with common ESG prefixes followed by a dash
  if (lowercaseId.startsWith('environmental-') || 
      lowercaseId.startsWith('social-') || 
      lowercaseId.startsWith('governance-')) {
    // But exclude specific non-header items that start with these patterns
    const nonHeaderPatterns = [
      'climate-adaptation',
      'climate-mitigation',
      'pollution-air',
      'pollution-water',
      'pollution-soil',
      'workforce-security',
      'workforce-hours'
    ];
    
    if (!nonHeaderPatterns.some(pattern => lowercaseId === pattern)) {
      return true;
    }
  }
  
  return false;
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
