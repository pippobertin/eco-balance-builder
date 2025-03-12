
// ESG category pattern definitions for consistent use across components

// Categories for environmental themes
export const environmentalPatterns = [
  'climate-',      // Climate change themes (adaptation, mitigation, energy)
  'energy-',       // Energy themes
  'pollution-',    // Pollution themes
  'substances-',   // Substances of concern
  'water-',        // Water resources
  'marine-',       // Marine resources
  'ocean-',        // Ocean related
  'biodiversity-', // Biodiversity and ecosystems
  'ecosystem-',    // Ecosystem themes
  'species-',      // Species impact
  'soil-',         // Soil degradation
  'land-',         // Land use
  'circular-',     // Circular economy
  'resource-',     // Resource use
  'waste-'         // Waste management
];

// Categories for social themes
export const socialPatterns = [
  'workforce-',    // Own workforce
  'labor-',        // Workers in value chain
  'community-',    // Affected communities
  'indigenous-',   // Indigenous rights
  'consumer-',     // Consumers and end users
  'equality-',     // Equality and diversity
  'health-',       // Health and safety
  'privacy-',      // Data privacy
  'human-rights-'  // Human rights
];

// Categories for governance themes
export const governancePatterns = [
  'business-',     // Business conduct
  'corruption-',   // Active and passive corruption
  'whistleblower-',// Whistleblower protection
  'animal-',       // Animal welfare
  'political-',    // Political engagement
  'supplier-',     // Supplier relationships
  'gov-',          // General governance
  'ethics-',       // Business ethics
  'compliance-'    // Compliance
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
