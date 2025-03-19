
import { MaterialityIssue } from '../types';

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
