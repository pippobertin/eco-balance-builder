
// Utility function to translate ESG categories to Italian
export const translateESGCategory = (category: string): string => {
  switch (category) {
    case 'environmental':
      return 'Ambientale';
    case 'social':
      return 'Sociale';
    case 'governance':
      return 'Governance';
    default:
      return category;
  }
};

// Define the ESRS themes
export const esrsThemes = {
  environmental: [
    'Cambiamento climatico',
    'Inquinamento',
    'Acqua e risorse marine',
    'Biodiversità ed ecosistemi',
    'Uso delle risorse e economia circolare'
  ],
  social: [
    'Forza lavoro propria',
    'Lavoratori nella catena del valore',
    'Comunità interessate',
    'Consumatori e utenti finali'
  ],
  governance: [
    'Comportamento aziendale',
    'Governance e risk management',
    'Innovazione e R&S',
    'Etica aziendale e conformità'
  ]
};

// Define ESG category colors
export const categoryColors = {
  environmental: '#22c55e', // green-500
  social: '#3b82f6',       // blue-500
  governance: '#a855f7',   // purple-500
  default: '#94a3b8'       // slate-400
};

// Pattern matching to determine ESG category based on issue ID or keywords
export const getESGCategory = (issueId: string): 'environmental' | 'social' | 'governance' | 'default' => {
  const id = issueId.toLowerCase();
  
  // Environmental patterns
  if (
    id.includes('env') || 
    id.includes('climate') || 
    id.includes('water') || 
    id.includes('energy') || 
    id.includes('waste') || 
    id.includes('pollution') ||
    id.includes('biodiversity') ||
    id.includes('resource')
  ) {
    return 'environmental';
  }
  
  // Social patterns
  else if (
    id.includes('soc') || 
    id.includes('employee') || 
    id.includes('labor') || 
    id.includes('community') || 
    id.includes('health') || 
    id.includes('safety') ||
    id.includes('human') ||
    id.includes('diversity')
  ) {
    return 'social';
  }
  
  // Governance patterns
  else if (
    id.includes('gov') || 
    id.includes('board') || 
    id.includes('ethic') || 
    id.includes('compliance') || 
    id.includes('risk') || 
    id.includes('management') ||
    id.includes('transparency') ||
    id.includes('corruption')
  ) {
    return 'governance';
  }
  
  // Default category if no pattern matches
  return 'default';
};

// Calculate importance score for issues
export const calculateImportanceScore = (issue: any): number => {
  // Weight factors for different components
  const financialWeight = 0.4;
  const impactWeight = 0.4;
  const stakeholderWeight = 0.2;
  
  // Get relevant values (defaulting to 0 if not present)
  const financialRelevance = issue.financialRelevance || 0;
  const impactRelevance = issue.impactRelevance || 0;
  const stakeholderRelevance = issue.stakeholderRelevance || 0;
  
  // Calculate weighted score
  const score = (
    financialRelevance * financialWeight +
    impactRelevance * impactWeight +
    stakeholderRelevance * stakeholderWeight
  );
  
  return score;
};
