
// ESG category pattern definitions for consistent use across components

// Categories for environmental themes
export const environmentalPatterns = [
  'climate-', 'energy', 'pollution-', 'substances-', 
  'water-', 'ocean-', 'marine-', 'biodiversity-', 
  'species-', 'soil-', 'desertification', 'ecosystem-', 
  'resource-', 'waste'
];

// Categories for social themes
export const socialPatterns = [
  'labor-', 'supply-', 'community-', 'indigenous-', 
  'consumer-'
];

// Categories for governance themes
export const governancePatterns = [
  'business-', 'whistleblower-', 'animal-', 
  'political-', 'supplier-', 'corruption-'
];

// Utility function to determine ESG category based on ID
export const determineESGCategory = (id: string): 'environmental' | 'social' | 'governance' => {
  if (environmentalPatterns.some(pattern => id.startsWith(pattern))) {
    return 'environmental';
  } 
  else if (socialPatterns.some(pattern => id.startsWith(pattern))) {
    return 'social';
  } 
  return 'governance'; // Default to governance
};
