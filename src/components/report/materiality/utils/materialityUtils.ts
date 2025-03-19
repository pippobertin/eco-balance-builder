
import { MaterialityIssue, IROSelections } from '../types';

// Default materiality issues to use when no issues are found in the database
export const defaultMaterialityIssues: MaterialityIssue[] = [
  {
    id: 'mi-1',
    name: 'Climate Change',
    description: 'Impact of climate change on operations and environment',
    impactRelevance: 4,
    financialRelevance: 3,
    isMaterial: false
  },
  {
    id: 'mi-2',
    name: 'Water Management',
    description: 'Efficient use and conservation of water resources',
    impactRelevance: 3,
    financialRelevance: 2,
    isMaterial: false
  },
  {
    id: 'mi-3',
    name: 'Diversity & Inclusion',
    description: 'Promoting diversity and inclusion in the workplace',
    impactRelevance: 4,
    financialRelevance: 2,
    isMaterial: false
  }
];

// Define predefined issues that can be added
export const predefinedIssues: MaterialityIssue[] = [
  ...defaultMaterialityIssues,
  {
    id: 'mi-4',
    name: 'Energy Efficiency',
    description: 'Effective management and reduction of energy consumption',
    impactRelevance: 4,
    financialRelevance: 3,
    isMaterial: false
  },
  {
    id: 'mi-5',
    name: 'Waste Management',
    description: 'Reduction, reuse, and recycling of waste materials',
    impactRelevance: 3,
    financialRelevance: 2,
    isMaterial: false
  }
];

// Function to determine if a theme is a header theme
export const isHeaderTheme = (id: string, name: string): boolean => {
  return id.toLowerCase().includes('header') || name.toLowerCase().includes('header');
};

// Default empty IROSelections
export const emptyIROSelections: IROSelections = {
  selectedPositiveImpacts: [],
  selectedNegativeImpacts: [],
  selectedRisks: [],
  selectedOpportunities: [],
  selectedActions: []
};

// Calculate the average materiality matrix based on issues and stakeholder feedback
export const calculateAverageMatrix = (issues: MaterialityIssue[]) => {
  // Filter for material issues only
  const materialIssues = issues.filter(issue => issue.isMaterial);
  
  // Return the calculation result
  return {
    companyAssessment: materialIssues,
    stakeholderAssessment: materialIssues.map(issue => ({
      issueId: issue.id,
      relevance: issue.stakeholderRelevance || 0
    })),
    combinedAssessment: materialIssues
  };
};
