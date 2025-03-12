
import { predefinedIssues } from './materialityUtils';
import { determineESGCategory } from './categoryPatterns';
import { MaterialityIssue } from '../types';

// Categorize predefined issues by ESG category
export const categorizePredefinedIssues = () => {
  return predefinedIssues.map(issue => ({
    ...issue,
    category: determineESGCategory(issue.id)
  }));
};

// Create filtered lists of issues by category and theme
export const getIssuesByCategory = () => {
  const categorizedIssues = categorizePredefinedIssues();
  
  return {
    environmental: categorizedIssues.filter(issue => 
      issue.category === 'environmental' || 
      issue.id.startsWith('climate-') ||
      issue.id.startsWith('pollution-') ||
      issue.id.startsWith('water-') ||
      issue.id.startsWith('marine-') ||
      issue.id.startsWith('biodiversity-') ||
      issue.id.startsWith('ecosystem-') ||
      issue.id.startsWith('circular-')
    ),
    social: categorizedIssues.filter(issue => 
      issue.category === 'social' || 
      issue.id.startsWith('workforce-') ||
      issue.id.startsWith('labor-') ||
      issue.id.startsWith('community-') ||
      issue.id.startsWith('consumer-')
    ),
    governance: categorizedIssues.filter(issue => 
      issue.category === 'governance' || 
      issue.id.startsWith('gov-') ||
      issue.id.startsWith('corruption-') ||
      issue.id.startsWith('business-') ||
      issue.id.startsWith('political-') ||
      issue.id.startsWith('supplier-') ||
      issue.id.startsWith('ethics-')
    )
  };
};
