
// ESG category pattern definitions for consistent use across components

// Categories for environmental themes
export const environmentalPatterns = [
  'climate-',     // Climate change themes
  'pollution-',   // Pollution themes
  'water-',       // Water and marine resources
  'marine-',      // Marine resources
  'biodiversity-', // Biodiversity and ecosystems
  'ecosystem-',   // Ecosystem themes
  'species-',     // Species impact
  'circular-'     // Circular economy
];

// Categories for social themes
export const socialPatterns = [
  'workforce-',   // Own workforce
  'labor-',       // Workers in value chain
  'community-',   // Affected communities
  'consumer-'     // Consumers and end users
];

// Categories for governance themes
export const governancePatterns = [
  'gov-',         // Business conduct
  'corruption-',  // Active and passive corruption
  'business-',    // Business conduct
  'political-',   // Political engagement
  'supplier-',    // Supplier relationships
  'ethics-'       // Business ethics
];

// Utility function to determine ESG category based on ID
export const determineESGCategory = (id: string): 'environmental' | 'social' | 'governance' => {
  const lowerCaseId = id.toLowerCase();
  
  if (environmentalPatterns.some(pattern => lowerCaseId.startsWith(pattern))) {
    return 'environmental';
  } 
  else if (socialPatterns.some(pattern => lowerCaseId.startsWith(pattern))) {
    return 'social';
  } 
  return 'governance';
};
