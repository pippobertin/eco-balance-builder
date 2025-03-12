
// ESG category pattern definitions for consistent use across components

// Categories for environmental themes
export const environmentalPatterns = [
  'env-', 'climate-', 'energy-', 'pollution-', 'substances-', 
  'water-', 'ocean-', 'marine-', 'biodiversity-', 
  'species-', 'soil-', 'desertification', 'ecosystem-', 
  'resource-', 'waste-', 'circular-'
];

// Categories for social themes
export const socialPatterns = [
  'workforce-', 'labor-', 'supply-chain-', 'community-', 'indigenous-', 
  'consumer-', 'social-', 'stakeholder-'
];

// Categories for governance themes
export const governancePatterns = [
  'gov-', 'business-', 'whistleblower-', 'animal-', 
  'political-', 'supplier-', 'corruption-', 'ethics-',
  'compliance-', 'transparency-'
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
